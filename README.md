# Client–Server Messaging Visualizer

This browser-based application can be used to visualize calls and responses as well as data streams in client–server scenarios.


<br/>

## Literature

CSMV has appeared in the following publications:

<sub>Ari Korhonen, Giacomo Mariani, Peter Sormunen, Jan-Mikael Rybicki, Aleksi Lukkarinen, Lassi Haaranen, Artturi Tilanterä, and Juha Sorva. 2021. New Acos Content Types. In *Proceedings of SPLICE 2021 workshop CS Education Infrastructure for All III: From Ideas to Practice* at 52nd ACM Technical Symposium on Computer Science Education, March 15–16, 2021, online (SPLICE’21). 5 pages. Accessed March 27, 2021. Available at: https://cssplice.github.io/SIGCSE21/proceedings.html</sub>



<br/>

## Visualization Examples

### Client–Server Messaging

The figure below is from a visualization of communication between a web browser and a web server.

<img src="doc/github/csmv-vis-ex-ajax-get.png" alt="" width="50%" height="50%" />


### Registering an Event Handler

The figure below illustrates a step in a visualization that explains how to register an event handler for a Document Object Model element. The program is written in pseudocode, and both the explanations and the user interface are in Finnish.

<img src="doc/github/csmv-vis-ex-edp.png" alt="" width="50%" height="50%" />



<br/>

## Development Setup

1. Install [node.js](https://nodejs.org/en/)
2. Install [Gulp command line utility](https://gulpjs.com/): `npm install gulp-cli -g`
3. Install [Jest](https://jestjs.io/) to use it from the command line: `npm install jest -g`
4. Clone the Git repository (e.g., `git clone https://github.com/aleksi-lukkarinen/Client-Server-Messaging-Visualizer.git`)
5. Install the project dependencies by issuing `npm install` in the root folder of the project
6. Use Gulp to build the project.
