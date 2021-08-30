# Docs to OpenApi v.3


> @BaseConfig: Basic Api config


## Example 01 `glconf.json` (minimal)


      {
        "rootDir": "./src",
        "filetypes": ["ts","js"],
        "externalModules": [],
        "baseConfig": {
          "info": {
            "title": "Hello World",
            "version": "1.0.0",
            "description": "A sample API"
          },
          "servers": [
            {
              "url": "http://localhost:9257"
            }
          ]
        }
      }

## Example 02 `glconf.json` (Bearer JWT)

      {
        "rootDir": "./src",
        "filetypes": ["ts","js"],
        "externalModules": [],
        "outPutDir": "./dist",
        "baseConfig": {
          "info": {
            "title": "Hello World",
            "version": "1.0.0",
            "description": "A sample API"
          },
          "servers": [
            {
              "url": "http://localhost:9257"
            }
          ],
          "security": [
            {
              "bearerAuth": []
            }
          ],
          "components": {
            "securitySchemes": {
              "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
              }
            }
          }
        }
      }
