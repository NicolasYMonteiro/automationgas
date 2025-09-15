"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/expenses/route";
exports.ids = ["app/api/expenses/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fexpenses%2Froute&page=%2Fapi%2Fexpenses%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fexpenses%2Froute.ts&appDir=C%3A%5CUsers%5Cnicol%5CProjects%5CProjectsForLeads%5Cautomationgas%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cnicol%5CProjects%5CProjectsForLeads%5Cautomationgas&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fexpenses%2Froute&page=%2Fapi%2Fexpenses%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fexpenses%2Froute.ts&appDir=C%3A%5CUsers%5Cnicol%5CProjects%5CProjectsForLeads%5Cautomationgas%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cnicol%5CProjects%5CProjectsForLeads%5Cautomationgas&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_nicol_Projects_ProjectsForLeads_automationgas_app_api_expenses_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/expenses/route.ts */ \"(rsc)/./app/api/expenses/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/expenses/route\",\n        pathname: \"/api/expenses\",\n        filename: \"route\",\n        bundlePath: \"app/api/expenses/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\nicol\\\\Projects\\\\ProjectsForLeads\\\\automationgas\\\\app\\\\api\\\\expenses\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_nicol_Projects_ProjectsForLeads_automationgas_app_api_expenses_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/expenses/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZleHBlbnNlcyUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGZXhwZW5zZXMlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZleHBlbnNlcyUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNuaWNvbCU1Q1Byb2plY3RzJTVDUHJvamVjdHNGb3JMZWFkcyU1Q2F1dG9tYXRpb25nYXMlNUNhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPUMlM0ElNUNVc2VycyU1Q25pY29sJTVDUHJvamVjdHMlNUNQcm9qZWN0c0ZvckxlYWRzJTVDYXV0b21hdGlvbmdhcyZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBc0c7QUFDdkM7QUFDYztBQUN5QztBQUN0SDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHVHQUF1RztBQUMvRztBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQzZKOztBQUU3SiIsInNvdXJjZXMiOlsid2VicGFjazovL2F1dG9tYXRpb25nYXMvP2QzZjciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcbmljb2xcXFxcUHJvamVjdHNcXFxcUHJvamVjdHNGb3JMZWFkc1xcXFxhdXRvbWF0aW9uZ2FzXFxcXGFwcFxcXFxhcGlcXFxcZXhwZW5zZXNcXFxccm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2V4cGVuc2VzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvZXhwZW5zZXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2V4cGVuc2VzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiQzpcXFxcVXNlcnNcXFxcbmljb2xcXFxcUHJvamVjdHNcXFxcUHJvamVjdHNGb3JMZWFkc1xcXFxhdXRvbWF0aW9uZ2FzXFxcXGFwcFxcXFxhcGlcXFxcZXhwZW5zZXNcXFxccm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0IH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvZXhwZW5zZXMvcm91dGVcIjtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgc2VydmVySG9va3MsXG4gICAgICAgIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcywgaGVhZGVySG9va3MsIHN0YXRpY0dlbmVyYXRpb25CYWlsb3V0LCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fexpenses%2Froute&page=%2Fapi%2Fexpenses%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fexpenses%2Froute.ts&appDir=C%3A%5CUsers%5Cnicol%5CProjects%5CProjectsForLeads%5Cautomationgas%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cnicol%5CProjects%5CProjectsForLeads%5Cautomationgas&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/expenses/route.ts":
/*!***********************************!*\
  !*** ./app/api/expenses/route.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET),\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/web/exports/next-response */ \"(rsc)/./node_modules/next/dist/server/web/exports/next-response.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\n\n\nasync function GET(request) {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_2__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_3__.authOptions);\n        if (!session) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        const { searchParams } = new URL(request.url);\n        const category = searchParams.get(\"category\");\n        const search = searchParams.get(\"search\");\n        const where = {};\n        if (category && category !== \"all\") {\n            where.category = category;\n        }\n        if (search) {\n            where.OR = [\n                {\n                    description: {\n                        contains: search,\n                        mode: \"insensitive\"\n                    }\n                },\n                {\n                    user: {\n                        name: {\n                            contains: search,\n                            mode: \"insensitive\"\n                        }\n                    }\n                }\n            ];\n        }\n        const expenses = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.expense.findMany({\n            where,\n            include: {\n                user: {\n                    select: {\n                        name: true\n                    }\n                },\n                vehicle: {\n                    select: {\n                        name: true,\n                        plate: true\n                    }\n                }\n            },\n            orderBy: {\n                createdAt: \"desc\"\n            }\n        });\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json(expenses);\n    } catch (error) {\n        console.error(\"Error fetching expenses:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\nasync function POST(request) {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_2__.getServerSession)(_lib_auth__WEBPACK_IMPORTED_MODULE_3__.authOptions);\n        if (!session) {\n            return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n                error: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        const body = await request.json();\n        const { description, amount, category, vehicleId, notes } = body;\n        const expense = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.expense.create({\n            data: {\n                description,\n                amount: parseFloat(amount),\n                category,\n                notes,\n                userId: session.user.id,\n                vehicleId: vehicleId || null\n            },\n            include: {\n                user: {\n                    select: {\n                        name: true\n                    }\n                },\n                vehicle: {\n                    select: {\n                        name: true,\n                        plate: true\n                    }\n                }\n            }\n        });\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json(expense, {\n            status: 201\n        });\n    } catch (error) {\n        console.error(\"Error creating expense:\", error);\n        return next_dist_server_web_exports_next_response__WEBPACK_IMPORTED_MODULE_0__[\"default\"].json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBd0IsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDN0U7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2F1dG9tYXRpb25nYXMvLi9hcHAvYXBpL2V4cGVuc2VzL3JvdXRlLnRzPzNiNjQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlcXVlc3QsIE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJ1xyXG5pbXBvcnQgeyBwcmlzbWEgfSBmcm9tICdAL2xpYi9wcmlzbWEnXHJcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tICduZXh0LWF1dGgnXHJcbmltcG9ydCB7IGF1dGhPcHRpb25zIH0gZnJvbSAnQC9saWIvYXV0aCdcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQocmVxdWVzdDogTmV4dFJlcXVlc3QpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlcnZlclNlc3Npb24oYXV0aE9wdGlvbnMpXHJcbiAgICBpZiAoIXNlc3Npb24pIHtcclxuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdVbmF1dGhvcml6ZWQnIH0sIHsgc3RhdHVzOiA0MDEgfSlcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IHNlYXJjaFBhcmFtcyB9ID0gbmV3IFVSTChyZXF1ZXN0LnVybClcclxuICAgIGNvbnN0IGNhdGVnb3J5ID0gc2VhcmNoUGFyYW1zLmdldCgnY2F0ZWdvcnknKVxyXG4gICAgY29uc3Qgc2VhcmNoID0gc2VhcmNoUGFyYW1zLmdldCgnc2VhcmNoJylcclxuXHJcbiAgICBjb25zdCB3aGVyZTogYW55ID0ge31cclxuICAgIFxyXG4gICAgaWYgKGNhdGVnb3J5ICYmIGNhdGVnb3J5ICE9PSAnYWxsJykge1xyXG4gICAgICB3aGVyZS5jYXRlZ29yeSA9IGNhdGVnb3J5XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHNlYXJjaCkge1xyXG4gICAgICB3aGVyZS5PUiA9IFtcclxuICAgICAgICB7IGRlc2NyaXB0aW9uOiB7IGNvbnRhaW5zOiBzZWFyY2gsIG1vZGU6ICdpbnNlbnNpdGl2ZScgfSB9LFxyXG4gICAgICAgIHsgdXNlcjogeyBuYW1lOiB7IGNvbnRhaW5zOiBzZWFyY2gsIG1vZGU6ICdpbnNlbnNpdGl2ZScgfSB9IH0sXHJcbiAgICAgIF1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBleHBlbnNlcyA9IGF3YWl0IHByaXNtYS5leHBlbnNlLmZpbmRNYW55KHtcclxuICAgICAgd2hlcmUsXHJcbiAgICAgIGluY2x1ZGU6IHtcclxuICAgICAgICB1c2VyOiB7IHNlbGVjdDogeyBuYW1lOiB0cnVlIH0gfSxcclxuICAgICAgICB2ZWhpY2xlOiB7IHNlbGVjdDogeyBuYW1lOiB0cnVlLCBwbGF0ZTogdHJ1ZSB9IH0sXHJcbiAgICAgIH0sXHJcbiAgICAgIG9yZGVyQnk6IHsgY3JlYXRlZEF0OiAnZGVzYycgfSxcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGV4cGVuc2VzKVxyXG4gIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBleHBlbnNlczonLCBlcnJvcilcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW50ZXJuYWwgc2VydmVyIGVycm9yJyB9LCB7IHN0YXR1czogNTAwIH0pXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXF1ZXN0OiBOZXh0UmVxdWVzdCkge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBzZXNzaW9uID0gYXdhaXQgZ2V0U2VydmVyU2Vzc2lvbihhdXRoT3B0aW9ucylcclxuICAgIGlmICghc2Vzc2lvbikge1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSwgeyBzdGF0dXM6IDQwMSB9KVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXF1ZXN0Lmpzb24oKVxyXG4gICAgY29uc3QgeyBkZXNjcmlwdGlvbiwgYW1vdW50LCBjYXRlZ29yeSwgdmVoaWNsZUlkLCBub3RlcyB9ID0gYm9keVxyXG5cclxuICAgIGNvbnN0IGV4cGVuc2UgPSBhd2FpdCBwcmlzbWEuZXhwZW5zZS5jcmVhdGUoe1xyXG4gICAgICBkYXRhOiB7XHJcbiAgICAgICAgZGVzY3JpcHRpb24sXHJcbiAgICAgICAgYW1vdW50OiBwYXJzZUZsb2F0KGFtb3VudCksXHJcbiAgICAgICAgY2F0ZWdvcnksXHJcbiAgICAgICAgbm90ZXMsXHJcbiAgICAgICAgdXNlcklkOiBzZXNzaW9uLnVzZXIuaWQsXHJcbiAgICAgICAgdmVoaWNsZUlkOiB2ZWhpY2xlSWQgfHwgbnVsbCxcclxuICAgICAgfSxcclxuICAgICAgaW5jbHVkZToge1xyXG4gICAgICAgIHVzZXI6IHsgc2VsZWN0OiB7IG5hbWU6IHRydWUgfSB9LFxyXG4gICAgICAgIHZlaGljbGU6IHsgc2VsZWN0OiB7IG5hbWU6IHRydWUsIHBsYXRlOiB0cnVlIH0gfSxcclxuICAgICAgfSxcclxuICAgIH0pXHJcblxyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGV4cGVuc2UsIHsgc3RhdHVzOiAyMDEgfSlcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgY3JlYXRpbmcgZXhwZW5zZTonLCBlcnJvcilcclxuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnSW50ZXJuYWwgc2VydmVyIGVycm9yJyB9LCB7IHN0YXR1czogNTAwIH0pXHJcbiAgfVxyXG59XHJcbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJnZXRTZXJ2ZXJTZXNzaW9uIiwiYXV0aE9wdGlvbnMiLCJHRVQiLCJyZXF1ZXN0Iiwic2Vzc2lvbiIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsInNlYXJjaFBhcmFtcyIsIlVSTCIsInVybCIsImNhdGVnb3J5IiwiZ2V0Iiwic2VhcmNoIiwid2hlcmUiLCJPUiIsImRlc2NyaXB0aW9uIiwiY29udGFpbnMiLCJtb2RlIiwidXNlciIsIm5hbWUiLCJleHBlbnNlcyIsImV4cGVuc2UiLCJmaW5kTWFueSIsImluY2x1ZGUiLCJzZWxlY3QiLCJ2ZWhpY2xlIiwicGxhdGUiLCJvcmRlckJ5IiwiY3JlYXRlZEF0IiwiY29uc29sZSIsIlBPU1QiLCJib2R5IiwiYW1vdW50IiwidmVoaWNsZUlkIiwibm90ZXMiLCJjcmVhdGUiLCJkYXRhIiwicGFyc2VGbG9hdCIsInVzZXJJZCIsImlkIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/expenses/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./prisma */ \"(rsc)/./lib/prisma.ts\");\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    return null;\n                }\n                // Buscar usuário no banco de dados\n                const user = await _prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n                    where: {\n                        email: credentials.email\n                    }\n                });\n                if (!user) {\n                    return null;\n                }\n                // Verificar senha (em produção, use bcrypt)\n                // Para demonstração, vamos usar senhas simples\n                const validPasswords = {\n                    \"admin@test.com\": \"admin123\",\n                    \"atendente@test.com\": \"atendente123\"\n                };\n                if (validPasswords[credentials.email] !== credentials.password) {\n                    return null;\n                }\n                return {\n                    id: user.id,\n                    email: user.email,\n                    name: user.name,\n                    role: user.role\n                };\n            }\n        })\n    ],\n    session: {\n        strategy: \"jwt\"\n    },\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.role = user.role;\n                token.id = user.id;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token) {\n                session.user.id = token.id;\n                session.user.role = token.role;\n            }\n            return session;\n        }\n    },\n    secret: process.env.NEXTAUTH_SECRET,\n    pages: {\n        signIn: \"/auth/signin\"\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFDaUU7QUFDaEM7QUFHMUIsTUFBTUUsY0FBK0I7SUFDMUNDLFdBQVc7UUFDVEgsMkVBQW1CQSxDQUFDO1lBQ2xCSSxNQUFNO1lBQ05DLGFBQWE7Z0JBQ1hDLE9BQU87b0JBQUVDLE9BQU87b0JBQVNDLE1BQU07Z0JBQVE7Z0JBQ3ZDQyxVQUFVO29CQUFFRixPQUFPO29CQUFZQyxNQUFNO2dCQUFXO1lBQ2xEO1lBQ0EsTUFBTUUsV0FBVUwsV0FBVztnQkFDekIsSUFBSSxDQUFDQSxhQUFhQyxTQUFTLENBQUNELGFBQWFJLFVBQVU7b0JBQ2pELE9BQU87Z0JBQ1Q7Z0JBRUEsbUNBQW1DO2dCQUNuQyxNQUFNRSxPQUFPLE1BQU1WLDJDQUFNQSxDQUFDVSxJQUFJLENBQUNDLFVBQVUsQ0FBQztvQkFDeENDLE9BQU87d0JBQ0xQLE9BQU9ELFlBQVlDLEtBQUs7b0JBQzFCO2dCQUNGO2dCQUVBLElBQUksQ0FBQ0ssTUFBTTtvQkFDVCxPQUFPO2dCQUNUO2dCQUVBLDRDQUE0QztnQkFDNUMsK0NBQStDO2dCQUMvQyxNQUFNRyxpQkFBaUI7b0JBQ3JCLGtCQUFrQjtvQkFDbEIsc0JBQXNCO2dCQUN4QjtnQkFFQSxJQUFJQSxjQUFjLENBQUNULFlBQVlDLEtBQUssQ0FBZ0MsS0FBS0QsWUFBWUksUUFBUSxFQUFFO29CQUM3RixPQUFPO2dCQUNUO2dCQUVBLE9BQU87b0JBQ0xNLElBQUlKLEtBQUtJLEVBQUU7b0JBQ1hULE9BQU9LLEtBQUtMLEtBQUs7b0JBQ2pCRixNQUFNTyxLQUFLUCxJQUFJO29CQUNmWSxNQUFNTCxLQUFLSyxJQUFJO2dCQUNqQjtZQUNGO1FBQ0Y7S0FDRDtJQUNEQyxTQUFTO1FBQ1BDLFVBQVU7SUFDWjtJQUNBQyxXQUFXO1FBQ1QsTUFBTUMsS0FBSSxFQUFFQyxLQUFLLEVBQUVWLElBQUksRUFBRTtZQUN2QixJQUFJQSxNQUFNO2dCQUNSVSxNQUFNTCxJQUFJLEdBQUdMLEtBQUtLLElBQUk7Z0JBQ3RCSyxNQUFNTixFQUFFLEdBQUdKLEtBQUtJLEVBQUU7WUFDcEI7WUFDQSxPQUFPTTtRQUNUO1FBQ0EsTUFBTUosU0FBUSxFQUFFQSxPQUFPLEVBQUVJLEtBQUssRUFBRTtZQUM5QixJQUFJQSxPQUFPO2dCQUNUSixRQUFRTixJQUFJLENBQUNJLEVBQUUsR0FBR00sTUFBTU4sRUFBRTtnQkFDMUJFLFFBQVFOLElBQUksQ0FBQ0ssSUFBSSxHQUFHSyxNQUFNTCxJQUFJO1lBQ2hDO1lBQ0EsT0FBT0M7UUFDVDtJQUNGO0lBQ0FLLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsZUFBZTtJQUNuQ0MsT0FBTztRQUNMQyxRQUFRO0lBQ1Y7QUFDRixFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYXV0b21hdGlvbmdhcy8uL2xpYi9hdXRoLnRzP2JmN2UiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSBcIm5leHQtYXV0aFwiXHJcbmltcG9ydCBDcmVkZW50aWFsc1Byb3ZpZGVyIGZyb20gXCJuZXh0LWF1dGgvcHJvdmlkZXJzL2NyZWRlbnRpYWxzXCJcclxuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSBcIi4vcHJpc21hXCJcclxuaW1wb3J0IHsgVXNlclJvbGUgfSBmcm9tIFwiQHByaXNtYS9jbGllbnRcIlxyXG5cclxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBDcmVkZW50aWFsc1Byb3ZpZGVyKHtcclxuICAgICAgbmFtZTogXCJjcmVkZW50aWFsc1wiLFxyXG4gICAgICBjcmVkZW50aWFsczoge1xyXG4gICAgICAgIGVtYWlsOiB7IGxhYmVsOiBcIkVtYWlsXCIsIHR5cGU6IFwiZW1haWxcIiB9LFxyXG4gICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiBcIlBhc3N3b3JkXCIsIHR5cGU6IFwicGFzc3dvcmRcIiB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xyXG4gICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcclxuICAgICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBCdXNjYXIgdXN1w6FyaW8gbm8gYmFuY28gZGUgZGFkb3NcclxuICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgcHJpc21hLnVzZXIuZmluZFVuaXF1ZSh7XHJcbiAgICAgICAgICB3aGVyZToge1xyXG4gICAgICAgICAgICBlbWFpbDogY3JlZGVudGlhbHMuZW1haWxcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICBpZiAoIXVzZXIpIHtcclxuICAgICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBWZXJpZmljYXIgc2VuaGEgKGVtIHByb2R1w6fDo28sIHVzZSBiY3J5cHQpXHJcbiAgICAgICAgLy8gUGFyYSBkZW1vbnN0cmHDp8OjbywgdmFtb3MgdXNhciBzZW5oYXMgc2ltcGxlc1xyXG4gICAgICAgIGNvbnN0IHZhbGlkUGFzc3dvcmRzID0ge1xyXG4gICAgICAgICAgJ2FkbWluQHRlc3QuY29tJzogJ2FkbWluMTIzJyxcclxuICAgICAgICAgICdhdGVuZGVudGVAdGVzdC5jb20nOiAnYXRlbmRlbnRlMTIzJ1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbGlkUGFzc3dvcmRzW2NyZWRlbnRpYWxzLmVtYWlsIGFzIGtleW9mIHR5cGVvZiB2YWxpZFBhc3N3b3Jkc10gIT09IGNyZWRlbnRpYWxzLnBhc3N3b3JkKSB7XHJcbiAgICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGlkOiB1c2VyLmlkLFxyXG4gICAgICAgICAgZW1haWw6IHVzZXIuZW1haWwsXHJcbiAgICAgICAgICBuYW1lOiB1c2VyLm5hbWUsXHJcbiAgICAgICAgICByb2xlOiB1c2VyLnJvbGUsXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIF0sXHJcbiAgc2Vzc2lvbjoge1xyXG4gICAgc3RyYXRlZ3k6IFwiand0XCIsXHJcbiAgfSxcclxuICBjYWxsYmFja3M6IHtcclxuICAgIGFzeW5jIGp3dCh7IHRva2VuLCB1c2VyIH0pIHtcclxuICAgICAgaWYgKHVzZXIpIHtcclxuICAgICAgICB0b2tlbi5yb2xlID0gdXNlci5yb2xlXHJcbiAgICAgICAgdG9rZW4uaWQgPSB1c2VyLmlkXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHRva2VuXHJcbiAgICB9LFxyXG4gICAgYXN5bmMgc2Vzc2lvbih7IHNlc3Npb24sIHRva2VuIH0pIHtcclxuICAgICAgaWYgKHRva2VuKSB7XHJcbiAgICAgICAgc2Vzc2lvbi51c2VyLmlkID0gdG9rZW4uaWQgYXMgc3RyaW5nXHJcbiAgICAgICAgc2Vzc2lvbi51c2VyLnJvbGUgPSB0b2tlbi5yb2xlIGFzIFVzZXJSb2xlXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlc3Npb25cclxuICAgIH0sXHJcbiAgfSxcclxuICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcclxuICBwYWdlczoge1xyXG4gICAgc2lnbkluOiBcIi9hdXRoL3NpZ25pblwiLFxyXG4gIH0sXHJcbn1cclxuIl0sIm5hbWVzIjpbIkNyZWRlbnRpYWxzUHJvdmlkZXIiLCJwcmlzbWEiLCJhdXRoT3B0aW9ucyIsInByb3ZpZGVycyIsIm5hbWUiLCJjcmVkZW50aWFscyIsImVtYWlsIiwibGFiZWwiLCJ0eXBlIiwicGFzc3dvcmQiLCJhdXRob3JpemUiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwidmFsaWRQYXNzd29yZHMiLCJpZCIsInJvbGUiLCJzZXNzaW9uIiwic3RyYXRlZ3kiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsInNlY3JldCIsInByb2Nlc3MiLCJlbnYiLCJORVhUQVVUSF9TRUNSRVQiLCJwYWdlcyIsInNpZ25JbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\nconst globalForPrisma = globalThis;\nconst prisma = globalForPrisma.prisma ?? new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\nif (true) globalForPrisma.prisma = prisma;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUE2QztBQUU3QyxNQUFNQyxrQkFBa0JDO0FBSWpCLE1BQU1DLFNBQVNGLGdCQUFnQkUsTUFBTSxJQUFJLElBQUlILHdEQUFZQSxHQUFFO0FBRWxFLElBQUlJLElBQXlCLEVBQWNILGdCQUFnQkUsTUFBTSxHQUFHQSIsInNvdXJjZXMiOlsid2VicGFjazovL2F1dG9tYXRpb25nYXMvLi9saWIvcHJpc21hLnRzPzk4MjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSAnQHByaXNtYS9jbGllbnQnXHJcblxyXG5jb25zdCBnbG9iYWxGb3JQcmlzbWEgPSBnbG9iYWxUaGlzIGFzIHVua25vd24gYXMge1xyXG4gIHByaXNtYTogUHJpc21hQ2xpZW50IHwgdW5kZWZpbmVkXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IG5ldyBQcmlzbWFDbGllbnQoKVxyXG5cclxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWFcclxuIl0sIm5hbWVzIjpbIlByaXNtYUNsaWVudCIsImdsb2JhbEZvclByaXNtYSIsImdsb2JhbFRoaXMiLCJwcmlzbWEiLCJwcm9jZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/oauth","vendor-chunks/object-hash","vendor-chunks/preact","vendor-chunks/preact-render-to-string","vendor-chunks/uuid","vendor-chunks/yallist","vendor-chunks/lru-cache","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fexpenses%2Froute&page=%2Fapi%2Fexpenses%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fexpenses%2Froute.ts&appDir=C%3A%5CUsers%5Cnicol%5CProjects%5CProjectsForLeads%5Cautomationgas%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cnicol%5CProjects%5CProjectsForLeads%5Cautomationgas&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();