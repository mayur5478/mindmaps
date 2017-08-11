import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TopicService} from "../my-service.service";
import {Topics} from "../topics";
import {ViewContainerRef} from '@angular/core';
import {Overlay, overlayConfigFactory} from 'angular2-modal';
import {Modal} from 'angular2-modal/plugins/bootstrap';
import {Discussions} from "../discussions";
import {Question} from "../question";
import {Links} from "../links";
import {CustommodalComponent} from "../custommodal/custommodal.component";
import {BSModalContext} from "angular2-modal/plugins/bootstrap/src/modal-context";
declare var jquery:any;
declare var $:any;
declare var d3:any;

@Component({
  selector: 'app-topic-details',
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.css']
})
export class TopicDetailsComponent implements OnInit {
  sub:any;
  topic:Topics;
  selectedArray = [];
  svg ;
  discussion: Discussions[];
  errorMessage: string = '';
  data= {};
  linkAnswers = [];
  parentId ;


  constructor(private topicService:TopicService,
              private route:ActivatedRoute,
              private router:Router,
              overlay:Overlay, vcRef:ViewContainerRef, public modal:Modal) {
  }

  ngOnInit() {

  }

  private toDiscussions(r:any): Discussions{
  let discussions = <Discussions>({
    question: r.question,
    uid: r.uid,
    answers:r.answers});

  return discussions;
}
  constructDataForTree(children:any,answers:any){

    for(var index in answers){
      var result = this.discussion.filter(function( obj ) {
        return obj.uid == answers[index].childUid;
      });
      var newObj = {
        "name":result[0].question,
        "type":"children",
        "id":result[0].uid,
        "children":[],
        "answer":answers[index].answer
      };
      children.push(newObj);
      this.constructDataForTree(newObj["children"],result[0].answers);
    }

  }

  ngAfterViewInit() {
    this.sub = this.route.params.subscribe(params => {
      let id = Number.parseInt(params['uid']);
      this.parentId = Number.parseInt(params['id']);
      let name = params['name'];
      this.topicService
        .getAllDiscussions()
        .then(discussion => {
          this.discussion = discussion;

         this.discussion =  this.discussion.map(this.toDiscussions);

          this.data["name"] = name;
          this.data["type"] = "action";

          var result = this.discussion.filter(function( obj ) {
            return obj.uid == id;
          });
          this.data["children"] = [] ;

          console.log("Result",result);
          if(result.length>0) {
            var newObj = {
              "name": result[0].question,
              "type": "children",
              "id": result[0].uid,
              "children": []
            };
            this.data["children"].push(newObj);
            this.constructDataForTree(newObj["children"],result[0].answers);
          }


          this.svg = d3.select(".droppable")
            .append("svg")
            .attr("height", 400)
            .attr("width", 950)
            .attr("id", "selectable");
          this.createTree();


        })
        .catch(errorMsg => this.errorMessage = errorMsg);
      /*.subscribe(p => this.topic = p);*/
    });

    /* $.post("http://139.59.39.117:8282/topic", {"name" : "Sports" }).done(function( data ) {
     $("#flag").html( "Data Loaded: " + data.success );
     });*/

  }


  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  gotoTopicsList() {
    let link = ['/topics'];
    this.router.navigate(link);
  }

  createTree() {
    var that = this;

    var data = this.data;
    var zoomStep = 0.2;1
    var actualZoomLevel = 1.0;
    var MAX_ZOOM_IN = 2.0;
    var MAX_ZOOM_OUT = 0.2;
    var zoom, circle, g;
// ************** Generate the tree diagram	 *****************
    var margin = {top: 40, right: 20, bottom: 20, left: 20},
      width = 960 - margin.right - margin.left,
      height = 500 - margin.top - margin.bottom;

    var treemap = d3.tree()
      .size([height, width]);

    var root = null, i = 0, j = 0, duration = 750, rectW = 60,
      rectH = 30;
    /* var diagonal = d3.svg.diagonal()
     .projection(function(d) { return [d.x, d.y]; });
     */
    var svg = d3.select("#selectable")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    root = d3.hierarchy(data, function (d) {
      return d.children;
    });
    root.x0 = height / 2;
    root.y0 = 0;

    var treeData = treemap(root);

    var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);
   //
    // var linkAnswer = links.slice(1);

    update(root);

    var selected = null,previousSelected = null, selectedLine = null, selectedLineElement = null;

    function update(source) {

      nodes.forEach(function (d) {
        d.y = d.depth * 500;

      });


// Assigns the x and y position for the nodes
      // ### LINKS

      // Update the links...
      var link = svg.selectAll('g.glink').data(links, function (d) {
          return d.id;
        })
        ;

            // Enter any new links at the parent's previous position.
      var linkEnter = link.enter().append('g').attr('class','glink').attr('x1', function (d) {
          return source.y0;
        }).attr('y1', function (d) {
          return source.x0;
        }).attr('x2', function (d) {
          return source.y0;
        }).attr('y2', function (d) {
          return source.x0;
        });

        linkEnter.append("line").attr("class", "link").attr("stroke-width", 2).attr("stroke", 'black').attr('cursor', 'pointer').on('click', lineClick);
        linkEnter.append("text").attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 16px Arial")
        .attr("class", "linkText")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) {

          return d.data.answer;
        });


      var linkUpdate = linkEnter.merge(link);


      // Transition back to the parent element position
      linkUpdate.transition().duration(duration).attr('x1', function (d) {

        return d.parent.y;
      }).attr('y1', function (d) {
        return d.parent.x;
      }).attr('x2', function (d) {
        return d.y;
      }).attr('y2', function (d) {
        return d.x;
      });

      linkUpdate.select("line.link").transition().duration(duration).attr('x1', function (d) {


        return d.parent.y;
      }).attr('y1', function (d) {
        return d.parent.x;
      }).attr('x2', function (d) {
        return d.y;
      }).attr('y2', function (d) {
        return d.x;
      });

    linkUpdate.select("text").transition().duration(duration).attr("transform", function (d) {
        return "translate(" + (d.y + d.parent.y) / 2 + "," + (d.x + d.parent.x) / 2 + ")";
      });

      // Remove any exiting links
      var linkExit = link.exit().transition().duration(duration).attr('x1', function (d) {
        return source.x;
      }).attr('y1', function (d) {
        return source.y;
      }).attr('x2', function (d) {
        return source.x;
      }).attr('y2', function (d) {
        return source.y;
      }).remove();

      /*linkExit.select("text").transition().duration(duration).attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      }).remove();
*/

      // ### CIRCLES

      var zoom = function () {
        var scale = d3.event.transform.k,
          translation = d3.event.transform;
        /*
         tbound = -height * scale,
         bbound = height * scale,
         lbound = (-width ) * scale,
         rbound = (width ) * scale;
         */
        // limit translation to thresholds
          translation = [
            translation.x,
            translation.y
          ];
        svg.attr("transform", "translate(" + translation + ")" + " scale(" + scale + ")");
      };
      d3.select("svg")
        .call(d3.zoom()
          .scaleExtent([0.5, 5])
          .on("zoom", zoom));

      //Create the
      // and drop behavior to set for the objects crated
      var drag = d3.drag()
      /*.origin(function(d) { return d; })*/
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", stopped);

      //Called when drag event starts. It stop the propagation of the click event
      function dragstarted(d) {
        console.log("here");
        d3.event.sourceEvent.stopPropagation();
        selected = d;
        d3.selectAll("rect").style("fill", "#fff");
        d3.select(this).select("text").style("fill","#fff");
        d3.select(this).select("rect").style("fill", "#000");
       update(d);

      }

      //Called when the drag event occurs (object should be moved)
      function dragged(d) {

        d.x += d3.event.dy;
        d.y += d3.event.dx;

        //Translate the object on the actual moved point
        d3.select(this).attr("transform", function () {
          return "translate(" + d.y + "," + d.x + ")";
        });

      }

      function tick(selected) {

        d3.select(this).attr("transform", function (d) {
          return "translate(" + d.y + "," + d.x + ")";
        });

        d3.selectAll('line.link').attr("x1", function (d) {
          return d.parent.y;
        })
          .attr("y1", function (d) {
            return d.parent.x;
          })
          .attr("x2", function (d) {
            return d.y;
          })
          .attr("y2", function (d) {
            return d.x;
          });

      };

      function stopped(d) {

        tick(d);

        update(d);

      }

      // Update the nodes...
      var node = svg.selectAll('g.node')
          .data(nodes, function (d) {
            return d.id || (d.id = ++i);
          })
        ;

      // Enter any new modes at the parent's previous position.
      var nodeEnter = node.enter().append('g').attr('class', 'node').attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
        .classed('draggable', true)
        .call(drag).attr('cursor', 'pointer');

      // Add Circle for the nodes
      nodeEnter.append('rect').attr('class', 'node').attr('width', function(d){
        console.log(d.data);
        return d.data.name.length * 11 + 24
      }).attr("height",20)
      ;

      nodeEnter.append("text")
        .attr("dx", 12)
        .attr("dy", "1em")
        .text(function (d) {
          return d.data.name;
        });


      // Update
      var nodeUpdate = nodeEnter.merge(node);

      // Transition to the proper position for the node
      nodeUpdate.transition().duration(duration).attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

      // Update the node attributes and style
      nodeUpdate.select('rect.node').attr("width", function(d){
        console.log(d.data);
        return d.data.name.length * 11 +24 ;
      })
        .attr("height", 20);

      nodeUpdate.select('text').attr("dx", 12)
        .attr("dy", "1em")
        .text(function (d) {
          return d.data.name;
        })
      ;
      nodeUpdate.on('click', click);
      // Remove any exiting nodes
      var nodeExit = node.exit().transition().duration(duration).attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
      }).remove();

      // On exit reduce the node circles size to 0
      nodeExit.select('rect').attr('width', 0).attr("height",0);

      // Store the old positions for transition.
      nodes.forEach(function (d) {
        d.x0 = d.x;
        d.y0 = d.y;
      });

      /*var linkAnswers = svg.selectAll('text.linkText').data(linkAnswer);*/
/*

      var linkAnswersEnter = linkAnswers.enter().append("text").attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 16px Arial")
        .attr("class", "linkText")
        .attr("transform", function (d) {
          return "translate(" +
            (source.y0) + "," +
            (source.x0) + ")";
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(function (d) {
          console.log("d",d);
          return d.data.answer;
        });
*/


/*

      var linkAnswerUpdate = linkAnswersEnter.merge(linkAnswers);
      linkAnswerUpdate.transition().duration(duration).attr("transform", function (d) {
        console.log(d);
        return "translate(" + (d.y + d.parent.y) / 2 + "," + (d.x + d.parent.x) / 2 + ")";
      });
*/



      // Toggle children on click.
      function click(d) {
        d3.selectAll("rect").style("fill", "#fff");
        d3.selectAll("g.node").select("text").style("fill","#000");
        d3.event.stopPropagation();
        selected = d;
        d3.select(this).select("rect").style("fill", "#000");
        d3.select(this).select("text").style("fill","#fff");
        previousSelected = this;
        update(d);
      }

      function lineClick(d) {
        d3.event.stopPropagation();
        selectedLine = d;
        d3.selectAll("line").style("stroke", "#ccc");
        d3.select(this).style("stroke", "#000");
        update(d);
      }


      $('.addAnswer').unbind('click');
      $('.addAnswer').click(function () {
        that.modal.prompt()
          .size('lg')
          .isBlocking(true)
          .showClose(true)
          .keyboard(27)
          .title('Enter an Answer')
          .open()
          .then(dialog => dialog.result)
          .then(result => {
            selectedLine.data.answer = result;
//            linkAnswer.push(selectedLine);
            update(selectedLine);
            selectedLine = null;
          });
      });
      $('.addNode').unbind('click');
      $('.addNode').click(function () {


        if((selected.data&&selected.data.type=="action")||(selected.type&&selected.type=="action") && (selected.data&&selected.data.children.length == 0)
          ||(selected.children&&selected.children.length==0)||(selected.data&&selected.data.type!="action")
          ||(selected.type&&selected.type!="action")) {
          console.log("type",selected);
          if ((selected.type&&selected.type!="action")||(selected.data&&selected.data.type!="action")) {
            that.modal.open(CustommodalComponent, overlayConfigFactory({
              num1: 2,
              num2: 3
            }, BSModalContext)).then(dialog =>dialog.result)
              .then(result => {

                let question = <Question>({
                  question: result.split("//////")[0]
                });

                that.topicService
                  .addDiscussion(question)
                  .then(msg => {

                    console.log(msg);
                    if (selected.data.id) {
                      var id = selected.data.id.toString();
                    } else {
                      var id = selected.id.toString();
                    }
                    let link = <Links>({
                      source_uid: id,
                      destination_uid: msg.uid.toString(),
                      source_type: "discussion",
                      answer: result.split("//////")[1]
                    });
                    that.topicService
                      .createLink(link)
                      .then(msg1 => {


                        var newNodeObj = {
                          type: 'resource-delete',
                          name: result.split("//////")[0],
                          attributes: [],
                          children: []
                        };

                        //Creates new Node
                        var newNode = d3.hierarchy(newNodeObj);
                        newNode.depth = selected.depth + 1;
                        newNode.height = selected.height - 1;
                        newNode.parent = selected;
                        newNode.id = msg.uid;

                        if (!selected.children) {
                          selected.children = [];
                          selected.data.children = [];
                        }
                        // root.merge(newNode);
                        selected.children.push(newNode);
                        selected.data.children.push(newNode.data);
                        if (selected.parent) {
                          newNode.x = selected.parent.x;
                          newNode.x0 = selected.parent.x0;
                        }
                        else {
                          newNode.x = height / 2;
                          newNode.x0 = height / 2;
                        }
                        newNode.y = (selected.depth + 1) * 180;
                        newNode.y0 = (selected.depth + 1) * 180;
                        newNode.data.answer = result.split("//////")[1];
                        nodes.push(newNode);
                        links.push(newNode);

                        update(selected);

                      }) .catch(errorMsg => this.errorMessage = errorMsg);
                  });
              });
          }
          else if((selected.type&&selected.type=="action")||(selected.data&&selected.data.type=="action")
            && (selected.children&&selected.children.length ==0 )|| (selected.data&& selected.data.children.length == 0)){

            that.modal.prompt()
              .size('lg')
              .isBlocking(true)
              .showClose(true)
              .keyboard(27)
              .title('Add new question')
              .open()
              .then(dialog => dialog.result)
              .then(result => {

                let question = <Question>({
                  question: result
                });

                that.topicService
                  .addDiscussion(question)
                  .then(msg => {

                    if (selected.data.id) {
                      var id = selected.data.id.toString();
                    } else {
                      var id = selected.id.toString();
                    }

                    let link = <Links>({
                      source_uid: that.parentId.toString(),
                      destination_uid: msg.uid.toString(),
                      source_type: "topic",
                      answer: ""
                    });
                    that.topicService
                      .createLink(link)
                      .then(msg1 => {


                        var newNodeObj = {
                          type: 'resource-delete',
                          name: result,
                          attributes: [],
                          children: []
                        };

                        //Creates new Node
                        var newNode = d3.hierarchy(newNodeObj);
                        newNode.depth = selected.depth + 1;
                        newNode.height = selected.height - 1;
                        newNode.parent = selected;
                        newNode.id = msg.uid;

                        if (!selected.children) {
                          selected.children = [];
                          selected.data.children = [];
                        }
                        // root.merge(newNode);
                        selected.children.push(newNode);
                        selected.data.children.push(newNode.data);
                        if (selected.parent) {
                          newNode.x = selected.parent.x;
                          newNode.x0 = selected.parent.x0;
                        }
                        else {
                          newNode.x = height / 2;
                          newNode.x0 = height / 2;
                        }
                        newNode.y = (selected.depth + 1) * 180;
                        newNode.y0 = (selected.depth + 1) * 180;
                        nodes.push(newNode);
                        links.push(newNode);
                        that.data["children"].push(newNode);

                        update(selected);
                      }).catch(errorMsg => this.errorMessage = errorMsg);
                  });
              });


          }
        }
      });


      $('.removeNode').unbind('click');
      $('.removeNode').click(function () {

        //make new set of children
        var children = [];
        var childrenData = [];
        //iterate through the children
        selected.parent.children.forEach(function (child) {
          if (child.id != selected.id) {
            //add to the child list if target id is not same
            //so that the node target is removed.
            children.push(child);
            childrenData.push(child.data);
          }
        });

        traverse(nodes, selected);
        traverse(links, selected);
        //traverse(linkAnswer, selected);
        //set the target parent with new set of children sans the one which is removed
        selected.children = [];
        if (children.length == 0) {
          selected.children = null;
          selected.parent.children = null;
          selected.parent.data.children = null;
        }
        else {
          selected.parent.children = children;
          selected.parent.data.children = childrenData;
        }
        //redraw the parent since one of its children is removed
        update(selected.parent);
      });

      function traverse(array, selectedArrayElement) {
        for (var index in array) {
          if (array[index].id == selectedArrayElement.id) {
            array.splice(index, 1);
            break;
          }

        }
        if (selectedArrayElement.children && selectedArrayElement.children.length > 0) {
          for (var i in selectedArrayElement.children) {
            traverse(array, selectedArrayElement.children[i]);
          }
        }
      }

      function pushAllChildren(selectedArrayElement, array) {
        array.push(selectedArrayElement);
        if (selectedArrayElement.children && selectedArrayElement.children.length > 0) {
          for (var i in selectedArrayElement.children) {
            pushAllChildren(selectedArrayElement.children[i], array);
          }
        }
      }

      $('.expandCollapse').unbind('click');
      $('.expandCollapse').click(function () {
        if (selected.children) {
          selected._children = selected.children;

          for (var i = 0; i < selected.children.length; i++) {
            traverse(nodes, selected.children[i]);

          }
          for (var i = 0; i < selected.children.length; i++) {
            traverse(links, selected.children[i]);
          }

         /* for (var i = 0; i < selected.children.length; i++) {
            traverse(linkAnswer, selected.children[i]);
          }*/

          $('.addNode').hide();
          selected.children = null;
        } else {
          selected.children = selected._children;
          for (var i = 0; i < selected.children.length; i++) {
            pushAllChildren(selected.children[i], nodes);
          }
          for (var i = 0; i < selected.children.length; i++) {
            pushAllChildren(selected.children[i], links);
          }
          /*for (var i = 0; i < selected.children.length; i++) {
            pushAllChildren(selected.children[i], linkAnswer);
          }*/
          selected._children = null;
          $('.addNode').show();
        }
       // console.log(linkAnswer);
        update(selected);
      });
      $('.renameNode').unbind('click');
      $('.renameNode').click(function () {
        var name = selected.data.name;
        that.modal.prompt()
          .size('lg')
          .isBlocking(true)
          .showClose(true)
          .keyboard(27)
          .title('Change the name of the node ' + name)
          .open()
          .then(dialog => dialog.result)
          .then(result => {

            let discussion = <Discussions>({
              question: result,
              uid: selected.id});
            that.topicService
              .renameDiscussion(discussion)
              .then(msg => {

                selected.data.name = result;
                update(selected);
              });
            });
      });

    }

  }

  svgClicked() {
    d3.selectAll("line").style("stroke", "lightgrey");
    d3.selectAll("rect").style("fill", "white");
    d3.selectAll("g.node").select("text").style("fill","#000");
  }



}

