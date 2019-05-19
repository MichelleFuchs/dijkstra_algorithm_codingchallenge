const graph = require("./generatedGraph.json");

//These are the labels of the start and end points
const START = "Erde";
const END = "b3-r7-r4nd7";

//This will be our start and end point as numbered values
let startPoint;
let endPoint;

//Find start and end point as the position values (numbers)
//since the points are not named in the given graph
for (let i = 0; i < graph.nodes.length; i++) {
  if (graph.nodes[i].label == START)
    //if label == "Erde"
    startPoint = i;

  if (graph.nodes[i].label == END)
    //if label == "b3-r7-r4nd7"
    endPoint = i;
}


/**
 * Change the graph format to a "real graph" as object
 * with node as key (where start and end are numbers)
 * and all direct neighbors with costs as values
 */
let paths = {};
for (let i = 0; i < graph.nodes.length; i++) {
  paths[i] = {};
  for (let j = 0; j < graph.edges.length; j++) {
    if (graph.edges[j].source == i)
      paths[i][graph.edges[j].target] = graph.edges[j].cost;

    if (graph.edges[j].target == i)
      paths[i][graph.edges[j].source] = graph.edges[j].cost;
  }
}


/**
 * The findPath Function is a Dijkstra Algorithm
 * It take the graph, the start and end point
 * and return the cost and the path of the cheapest way
 */
function findPath(graph, start, end) {
  let totalCosts = {};
  let prevNodes = {};
  let visited = [];
  let minPQ = [];

  totalCosts[start] = 0; //Set cost from start node
  minPQ.push(start); //Add start node to our queue

  for (p in graph) {
    //set cost of every node (except the start node) to infinite
	if (p != start) 
		totalCosts[p] = Infinity;
  }

  while (minPQ.length > 0) { //while our queue is not empty
    let currentNode = minPQ.shift(); //get and remove the first node from the queue
    let neighbors = graph[currentNode]; // get all neighbors for our current node

    for (let nextNode in neighbors) { //for every neighbor
      if (!visited.includes(nextNode)) { //if the neighbor is NOT the way we came from
        let cost =  graph[currentNode][nextNode] + totalCosts[currentNode]; //add the previous cost and the new cost

        if (cost < totalCosts[nextNode]) { 
			//if the current cost is lower, it means the path is better than the previous or our initialized "Infinity"
			totalCosts[nextNode] = cost; //set the new cost for this node in our array

			if (!prevNodes[nextNode]) 
				prevNodes[nextNode] = []; //if not existing yet, set an empty array for the next node in our object
			
			if (prevNodes[currentNode]) //if there are previous nodes, save them for the next node + add the new previous one
				prevNodes[nextNode] = prevNodes[currentNode].concat(currentNode);
			else //else just save the new previous one
				prevNodes[nextNode].push(currentNode);

          minPQ.push(nextNode); //add the next node to the queue, so the algorithm will look for its neigbors
          visited.push(currentNode.toString); //save the current node as visited 
        }
      }
    }
  }

  //after every possible path was followed
  let results = {};
  results["costs"] = totalCosts[end]; //get the cost from out end point
  results["path"] = prevNodes[end]; //get the path to our end point

  return results;
}

let result = findPath(paths, startPoint, endPoint);

console.log("The cheapest path:");
console.log(result.path);
console.log("Costs: "+result.costs);
