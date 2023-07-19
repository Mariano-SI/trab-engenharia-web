const mysql = require('mysql');
const Database = require('../Database/Database');

class Resgate {
  constructor() {
    this.dbConnection = Database.connect();
  }

  getAllResgates(req, res) {
    this.dbConnection.beginTransaction();
    try {
      const sql = 'SELECT * FROM resgate';
      this.dbConnection.query(sql, function (error, results, fields) {
        return res.status(200).send(results);
      });
      this.dbConnection.commit();
    } catch (error) {
      this.dbConnection.rollback();
      throw new Error('Erro com servidor', 500);
    } finally {
      this.dbConnection.end();
    }
  }

  getResgateByidResgate(req, res) {
    const idResgate = req.params.idResgate;

    this.dbConnection.beginTransaction();
    try {
      const sql = `SELECT * FROM resgate WHERE resgate.idResgate  = ${idResgate}`;
      this.dbConnection.query(sql, function (error, results, fields) {
        return res.status(200).send(results);
      });
      this.dbConnection.commit();
    } catch (error) {
      this.dbConnection.rollback();
      throw new Error('Erro com servidor', 500);
    } finally {
      this.dbConnection.end();
    }
  }

  createResgate(req, res) {
    const resgateInfo = req.body;

    this.dbConnection.beginTransaction();
    try {
      const { dataResgate, idAnimal, nomeResgatante } = resgateInfo;

      const sql = `INSERT INTO resgate ( dataResgate, idAnimal, nomeResgatante) values ( '${dataResgate}', ${idAnimal}, '${nomeResgatante}')`;

      this.dbConnection.query(sql, function (error, results, fields) {
        return res.status(200).send(results);
      });
      this.dbConnection.commit();
    } catch (error) {
      this.dbConnection.rollback();
      throw new Error('Erro com servidor', 500);
    } finally {
      this.dbConnection.end();
    }
  }

  // deleteResgateByidResgate(req, res){
  //     const idResgate = req.params.cpf;

  //     this.dbConnection.beginTransaction();
  //     try {
  //         const sql = `DELETE FROM resgate where resgate.idResgate  = ${idResgate}`;
  //         this.dbConnection.query(sql, function(error, results, fields){
  //             return res.status(200).send(results);
  //          })
  //          this.dbConnection.commit();
  //     } catch (error) {
  //         this.dbConnection.rollback();
  //         throw new Error("Erro com servidor", 500)
  //     }finally{
  //         this.dbConnection.end();
  //     }
  // }

  updateResgateById(req, res) {
    const idAnimal = req.params.idAnimal;
    const { dataResgate, nomeResgatante } = req.body;

    this.dbConnection = Database.connect();
    this.dbConnection.beginTransaction();
    try {
      const setStatementCollumns = [];

      if (dataResgate) {
        setStatementCollumns.push(`dataResgate = '${dataResgate}'`);
      }
      if (nomeResgatante) {
        setStatementCollumns.push(`nomeResgatante = '${nomeResgatante}'`);
      }

      const sql = `UPDATE resgate SET ${setStatementCollumns.join(
        ',',
      )} where resgate.idAnimal = ${idAnimal}`;

      console.log(sql);

      this.dbConnection.query(sql, function () {
        return res.status(200).send({ msg: 'Resgate atualizado com sucesso!' });
      });
      this.dbConnection.commit();
    } catch (error) {
      this.dbConnection.rollback();
      throw new Error('Erro no servidor', 500);
    } finally {
      this.dbConnection.end();
    }
  }
}

module.exports = Resgate;
