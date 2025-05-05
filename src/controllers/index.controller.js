import { obtenerItinerarioDelDia } from "../helpers/schedule.js";

export const renderInfo = (req, res) => {
  const actividades = obtenerItinerarioDelDia();
  const hayActividades = actividades.length > 0;
  res.render("schedule", { actividades, hayActividades });
};

export const renderIndex = (req, res) => {
  res.render("index");
};

export const renderAbout = (req, res) => {
  res.render("about");
};

export const renderScanner = (req, res) => {
  res.render("scanner");
};
