document.CSMesVisSetupData = [
  {
    name: "CSMV Example 1.1",
    title: "Example 1.1: Getting an HTML File from a Web Server",
    description: "Please use the buttons below to browse through the steps of communication.",

    environment: {
      animationFrame: {
        width:  "800px",
        height: "500px"
      },
      buttons: {
        toFirstStepTitle: "Beginning",
        toPreviousStepTitle: "Back",
        toNextStepTitle: "Forward",
        toLastStepTitle: "End",
      }
    },

    actors: [
      {
        id: "c",
        title: "Browser",
        cssClasses: ["csmv-browser"],
        width: "100px",
        height: "200px",
      },
      {
        id: "s",   
        title: "Web Server",
        cssClasses: ["csmv-server"],
        width: "100px",
        height: "200px",
      },
      {
        id: "req", 
        cssClasses: ["csmv-textblock"],
        contentHTML: "<div class='csmv-textblock-title'>Can I please have the default file at the root?</div><div class='csmv-textblock-body'><tt>GET / HTTP/1.1</tt><br/><tt>Host: www.example.com</tt></div>",
        width: "300px",
        height: "300px",
      },
    ],

    steps: [
      {
        setup: [
          ["set-pos", "c", 200, 200],
          ["show", "c"],
          ["set-pos", "s", 400, 200],
          ["show", "s"],
          ["set-pos", "req", 300, 100],
          ["hide", "req"],
        ],
        transitionBackwards: [],
        transitionForwards: [],
      },
      {
        setup: [
          ["show", "req"],
        ],
      },
      {
        
      },
      {
        
      },
      {
        
      },
    ]
  },
  
  {
    name: "CSMV Example 1.2",
    
    environment: {
    },
      
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

    setup: [
    
    ],
      
    steps: [

    ]
  }
];
