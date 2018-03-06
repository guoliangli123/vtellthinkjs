module.exports = {
	"prompts": {
		"name": {
			"type": "string",
			"message": "Project name"
		},
		"description": {
			"type": "string",
			"message": "Project description",
			"default": "application created by thinkjs"
		},
		"author": {
			"type": "string",
			"message": "Author"
		},
		"babel": {
			"type": "confirm",
			"message": "Do you want to turn on babel?"
		}
	},
	"new": {
		"default": [
			["server/.vscode", "server/.vscode"],
			["server/src/bootstrap", "server/src/bootstrap"],
			["server/src/config", "server/src/config"],
			["server/src/controller/base.js", "server/src/controller/base.js"],
			["server/src/controller/index.js", "server/src/controller/index.js"],
			["server/src/logic", "server/src/logic"],
			["server/src/model", "server/src/model"],
			["server/test/index.js", "server/test/index.js"],
			["server/view/index_index.html", "server/view/index_index.html"],
			["server/www", "server/www"],
			["server/debug.js", "server/debug.js"],
			["server/development.js", "server/development.js"],
			["server/.editorconfig", "server/.editorconfig"],
			["server/.eslintrc", "server/.eslintrc"],
			["server/gitignore", "server/.gitignore"],
			["server/nginx.conf", "server/nginx.conf"],
			["server/package.json", "server/package.json"],
			["server/pm2.json", "server/pm2.json"],
			["server/.prettierignore", "server/.prettierignore"],
			["server/production.js", "server/production.js"],
			["server/README.md", "server/README.md"],
			["server/yarn.lock", "server/yarn.lock"],
			["gitignore", ".gitignore"],
			["fesrc/build", "fesrc/build"],
			["fesrc/css", "fesrc/css"],
			["fesrc/img", "fesrc/img"],
			["fesrc/js", "fesrc/js"],
			["fesrc/scripts", "fesrc/scripts"],
			["fesrc/eslintrc.js", "fesrc/eslintrc.js"],
			["fesrc/stylelintrc.js", "fesrc/stylelintrc.js"],
			["fesrc/package.json", "fesrc/package.json"],
			["fesrc/postcss.config.js", "fesrc/postcss.config.js"],
			["fesrc/yarn.lock", "fesrc/yarn.lock"]
		],
		"multiModule": [
			["server/.vscode", "server/.vscode"],
			["server/src/bootstrap", "server/src/bootstrap"],
			["server/src/config", "server/src/common/config"],
			["server/src/config/config.js", "server/src/[moduleName]/config.js"],
			["server/src/controller/base.js", "server/src/[moduleName]/controller/base.js"],
			["server/src/controller/index.js", "server/src/[moduleName]/controller/index.js"],
			["server/src/logic", "server/src/[moduleName]/logic"],
			["server/src/model", "server/src/[moduleName]/model"],
			["server/test/index.js", "server/test/index.js"],
			["server/view/index_index.html", "server/view/index_index.html"],
			["server/www", "server/www"],
			["server/debug.js", "server/debug.js"],
			["server/development.js", "server/development.js"],
			["server/.editorconfig", "server/.editorconfig"],
			["server/.eslintrc", "server/.eslintrc"],
			["server/nginx.conf", "server/nginx.conf"],
			["server/package.json", "server/package.json"],
			["server/pm2.json", "server/pm2.json"],
			["server/.prettierignore", "server/.prettierignore"],
			["server/production.js", "server/production.js"],
			["server/README.md", "server/README.md"],
			["server/yarn.lock", "server/yarn.lock"],
			["gitignore", ".gitignore"],
			["fesrc/build", "fesrc/build"],
			["fesrc/css", "fesrc/css"],
			["fesrc/img", "fesrc/img"],
			["fesrc/js", "fesrc/js"],
			["fesrc/scripts", "fesrc/scripts"],
			["fesrc/eslintrc.js", "fesrc/eslintrc.js"],
			["fesrc/stylelintrc.js", "fesrc/stylelintrc.js"],
			["fesrc/package.json", "fesrc/package.json"],
			["fesrc/postcss.config.js", "fesrc/postcss.config.js"],
			["fesrc/yarn.lock", "fesrc/yarn.lock"]
		]
	},
	"controller": {
		"default": [
			["server/src/controller/index.js", "server/src/[moduleName]/controller/[action].js"],
			["server/src/logic/index.js", "server/src/[moduleName]/logic/[action].js"]
		],
		"rest": [
			["server/src/controller/rest.js", "server/src/[moduleName]/controller/rest.js"],
			["server/src/controller/restIndex.js", "server/src/[moduleName]/controller/[action].js"],
			["server/src/logic/index.js", "server/src/[moduleName]/logic/[action].js"]
		]
	},
	"model": [
		["server/src/model/index.js", "server/src/[moduleName]/model/[action].js"]
	],
	"service": [
		["server/src/service/index.js", "server/src/[moduleName]/service/[action].js"]
	],
	"middleware": [
		["server/src/middleware/base.js", "server/src/[moduleName]/middleware/[action].js"]
	],
	"adapter": [
		["server/src/adapter/base.js", "server/src/[moduleName]/adapter/[type]/[action].js"]
	],
	"module": [
		["server/src/config/config.js", "server/src/[moduleName]/config/config.js"],
		["server/src/controller/base.js", "server/src/[moduleName]/controller/base.js"],
		["server/src/controller/index.js", "server/src/[moduleName]/controller/index.js"],
		["server/src/logic/index.js", "server/src/[moduleName]/logic/index.js"],
		["server/src/model/index.js", "server/src/[moduleName]/model/index.js"],
		["server/view/index_index.html", "server/view/[moduleName]/index_index.html"]
	],
	"skipCompile": [],
	"completeMessage": "To get started:\n\n<% if (!inPlace) { %># enter path\n$ cd <%= destDirName %>\n\n<% } %># install dependencies:\n$ npm install\n\n# run the app\n$ npm start"
}