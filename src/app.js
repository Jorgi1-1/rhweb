import express from "express";
import exphbs from "express-handlebars";
import session from "express-session";
import methodOverride from "method-override";
import flash from "connect-flash";
import passport from "passport";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

import { MONGODB_URI, PORT } from "./config.js";
import indexRoutes from "./routes/index.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js"; 
import "./config/passport.js";

import Handlebars from "handlebars"; // Agregar Handlebars para registrar helpers

// Initializations
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// settings
app.set("port", PORT);
app.set("views", join(__dirname, "views"));

// config view engine
const hbs = exphbs.create({
  defaultLayout: "main",
  layoutsDir: join(app.get("views"), "layouts"),
  partialsDir: join(app.get("views"), "partials"),
  extname: ".hbs",
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
  },
  helpers: {
    ifCond: function (v1, v2, options) {
      return v1 === v2 ? options.fn(this) : options.inverse(this);
    },
    calcNetSalary: function (payroll) {
      if (!payroll) return 0;
      const { baseSalary = 0, bonuses = 0, deductions = 0 } = payroll;
      return baseSalary + bonuses - deductions;
    },
    ifCond: (v1, v2, options) => (v1 === v2 ? options.fn(this) : options.inverse(this)),
    calcNetSalary: (payroll) => {
      if (!payroll) return 0;
      const { baseSalary = 0, bonuses = 0, deductions = 0 } = payroll;
      return baseSalary + bonuses - deductions;
    },    
  }
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");

// Registrar el helper 'eq' para la comparación
Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

// middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

app.use(indexRoutes);
app.use(authRoutes);
app.use(userRoutes);

// static files
app.use(express.static(join(__dirname, "public")));

// Manejo de errores
app.use((req, res, next) => {
  return res.status(404).render("404");
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", {
    error,
  });
});

export default app;