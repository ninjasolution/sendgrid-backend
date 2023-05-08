const { requestBotAPI } = require("../helpers");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Transaction = db.transaction;
const axios = require("axios").default;

exports.allUsers = (req, res) => {
  User.find()
    .populate('roles')
    .exec((err, users) => {

      if (err) {
        res.status(200).send({ message: err });
        return;
      }

      if (!users) {
        return res.status(404).send({ message: "Orders Not found." });
      }

      return res.status(200).send(users);
    })
};


exports.getUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate('roles')
    .exec((err, user) => {

      if (err) {
        res.status(200).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(200).send({ message: "User Not found.", status: "errors" });
      }

      return res.status(200).send(user);
    })
};

exports.setRole = (req, res) => {
  User.findOne({ _id: req.params.id })
    .populate('roles')
    .exec((err, user) => {

      if (err) {
        res.status(200).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "Orders Not found." });
      }

      Role
        .find({ name: req.params.role },
          (err, roles) => {
            if (err) {
              return;
            }
            user.roles = roles.map(role => role._id);
            user.save(err => {
              if (err) {
                return;
              }
              User.findOne({ _id: user._id })
                .populate('roles')
                .exec((err, fUser) => {
                  if (err) {
                    res.status(200).send({ message: err });
                    return;
                  }

                  if (!fUser) {
                    return res.status(404).send({ message: "Orders Not found." });
                  }
                  return res.status(200).json(fUser);
                })
            });

          }
        );
    })
};

exports.update = (req, res) => {
  User.findOne({ _id: req.idUser })
    .populate('roles')
    .exec(async (err, user) => {

      if (err) {
        res.status(200).send({ message: err, status: "errors" });
        return;
      }

      if (!user) {
        return res.status(200).send({ message: "User Not found.", status: "errors" });
      }

      user.username = req.body.username;
      user.withdrawAddress = req.body.withdrawAddress;
      user.city = req.body.city;
      user.country = req.body.country;
      user.phoneNumber = req.body.phoneNumber;
      user.zipCode = req.body.zipCode;
      user.apiKey = req.body.apiKey;
      user.apiSecret = req.body.apiSecret;
      if (req.body.apiKey) {
        user.apiKey = req.body.apiKey;
        user.apiSecret = req.body.apiSecret;
        try {
          var data = JSON.stringify({
            // idUser: req.body._id,
            idUser: 2250,
            apiKey: req.body.apiKey,
            apiSecret: req.body.apiSecret,
            enabled: user.enabled,
            // authCode: user.authCode,
            profit: user.profit,
            order_cents: user.orderCents,
            authCode: "1ee9394573062b6dbe275d9c570d52f4"
          });

          await requestBotAPI("put", "user", data)

        } catch (err) {
          return res.status(200).send({ message: err, status: "errors" });
        }
      }

      user.save(err => {
        if (err) {
          return res.status(200).send({ message: err, status: "errors" });
        }
        return res.status(200).json({status: "success", data: user});
      });
    })
};

exports.delete = (req, res) => {
  User.deleteOne({ _id: req.params.id })
    .exec(() => {
      res.status(200).send("success");
    })
};

exports.getStats = (req, res) => {

  User.findOne({ _id: req.params.id })
    .populate('roles')
    .exec(async (err, user) => {

      if (err) {
        return res.status(200).send({ message: err });
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found.", status: "errors" });
      }

      var resStats;
      try {
        resStats = await axios.post(`${process.env.BOT_API}/api/stats`, {
          // idUser: req.idUser,
          idUser: 2250,
          authCode: "1ee9394573062b6dbe275d9c570d52f4",
          // authCode: user.authCode
        })
      } catch (err) {
        return res.status(200).send({ message: err, status: "errors" });
      }

      return res.status(200).send({ data: resStats.data, status: "errors" });
    })
}

exports.checkVerification = (req, res) => {

  User.findOne({ _id: req.idUser })
    .exec(async (err, user) => {

      if (err) {
        return res.status(200).send({ message: err, status: "errors" });
      }

      if (!user) {
        return res.status(200).send({ message: err, status: "errors" });
      }

      try {

        return res.status(200).send({ message: {
          emailVerified: user.emailVerified,
          phoneVerified: user.phoneVerified
        }, status: "success" });
      } catch (err) {
        return res.status(200).send({ message: err, status: "errors" });
      }

    })
}

