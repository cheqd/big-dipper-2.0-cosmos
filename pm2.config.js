module.exports = {
    apps : [{
      name   : "big-dipper-2.0-cosmos",
      script : "./dist/index.js",
      exec_mode: "cluster",
      instances : "max",
      env: {
        "NODE_ENV": "production",
      }
    }]
  }
  