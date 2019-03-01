module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            unique: true,
            required: true,
            validate: {
                isEmail: true
            }
        },
        firstName: {
            type: DataTypes.STRING,
            required: true
        },
        lastName: {
            type: DataTypes.STRING,
            required: true
        },
        salt: DataTypes.STRING,
        hash: DataTypes.STRING,
        street: {
            type: DataTypes.STRING,
            required: true
        },
        city: {
            type: DataTypes.STRING,
            required: true
        },
        state: {
            type: DataTypes.STRING,
            required: true
        },
        zip: {
            type: DataTypes.STRING,
            required: true
        },
        phone: DataTypes.STRING
    });
    return User;
};
