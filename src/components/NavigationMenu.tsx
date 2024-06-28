import { Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

/**
 * Renders a vertical navigation menu for the Lux application.
 */
export function NavigationMenu() {
  return (
    <nav id="root-navigation">
      <Link as={NavLink} to="/accounting">Accounting</Link><br />
      <Link as={NavLink} to="/meal-planner">Meal Planner</Link><br />
    </nav>
  );
}
