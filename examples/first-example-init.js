document.CSMesVisSetupData = [
  {
    name: "CSMV Example 1.1",
    title: "Example 1.1: Getting an HTML File from a Web Server",
    description: "Please use the buttons below to browse through the steps of communication.",

    debug: {
      ignoreVisibility: false,
      highlightActorBorders: false,
    },

    environment: {
      animationFrame: {
        width:  "622px",
        height: "200px"
      },
      buttons: {
        toFirstStepTitle: "Beginning",
        toPreviousStepTitle: "Back",
        toNextStepTitle: "Forward",
        toLastStepTitle: "End",
        showToLastStepButton: false,
      },
      stepCounter: {
        show: true,
        showTotal: true,
        title: "Step",
      }
    },

    actors: [
      {
        id: "c",
        preset: "browser",
        stereotype: "node",
        title: "Browser",
        width: "100px",
        height: "150px",
      },
      {
        id: "s",
        preset: "server",
        stereotype: "node",
        title: "Web Server",
        width: "100px",
        height: "150px",
      },
      {
        id: "q",
        preset: "textblock",
        title: "Can I please have the default file at the root?",
        contentHTML: "<tt>GET / HTTP/1.1</tt><br/><tt>Host: www.acmefactory.com</tt><br/><tt>...</tt>",
        width: "18em",
        height: "4em",
      },
      {
        id: "a",
        cssClasses: ["ex1-textblock"],
        contentHTML: "<div class='ex1-textblock-title'>Sure! Here it is:</div><div class='ex1-textblock-content'><tt>HTTP/1.1 200 OK</tt><br/><tt>Date: Tue, 10 Mar 2020 16:29:22 GMT</tt><br/><tt>...</tt><br/><br/><tt>&lt;html&gt;</tt><br/><tt>&nbsp;&nbsp;&lt;head&gt;ACME Factories: Gags for Everyone!&lt;/head&gt;</tt><br/><tt>...</tt></div>",
        width: "18em",
        height: "8em",
      },
    ],

    steps: [
      {
        setup: [
          ["set-pos", "c", 20, 20],
          ["set-pos", "s", 500, 20],
          ["set-pos", "q", 140, 20],
          ["set-pos", "a", 200, 20],
          ["show", "c", "s"],
          ["hide", "q", "a"],
        ],
        transitionBackwards: [],
        transitionForwards: [],
      },
      {
        setup: [
          ["show", "q"],
        ],
      },
      {
        setup: [
          ["hide", "q", "a"],
        ],
      },
      {
        setup: [
          ["show", "a"],
        ],
      },
      {
        setup: [
          ["hide", "q", "a"],
        ],
      },
    ],
  },

  {
    name: "CSMV Example 1.2",

    environment: {
      animationFrame: {
        width:  "500px",
        height: "100px"
      },
    },
/*
    actors: [
      {
        class: "c",
        title: "Client",
      },
      {
        class: "s",
        name: "Server",
      }
    ],
*/
    setup: [

    ],

    steps: [

    ],
  },
];
