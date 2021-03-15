const Sequelize = require("sequelize");

module.exports = class solver_table extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                SolverID: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    allowNull: true
                },
                ChID: {
                    type: Sequelize.INTEGER(20),
                    allowNull: false
                },
                ID: {
                    type: Sequelize.STRING(30),
                    allowNull: false
                },
               
                created_at: {
                    type: Sequelize.DATE,
                    allowNull: true
                }


            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "solver_table",
                tableName: "solver_table",
                paranoid: false,
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci"
            }
        );
    }

    //   static associate(db) {
    //     db.User.hasMany(db.Comment, { foreignKey: 'commenter', sourceKey: 'id' });
    //   }
};