"use strict";

import { DataTypes, QueryInterface } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Messages", "visibility", {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.removeColumn('Messages', 'visibility');
    */
  }
};
