//importa o modulo do mysql
const mysql = require('mysql');

class CadAnimal{
    //Função para conectar o BD
    static connect(){
        //Cria conexao
        const connection = mysql.createConnection({
            host:'bd2-ufvjm.mysql.database.azure.com',
            user:'Mariano',
            password:'m-88443244',
            database:'ongAnimal',
        });
        //Conecta ao banco
        connection.connect();
        return connection;
    }

    static getAnimais(res){
        const connection = CadAnimal.connect();
        connection.beginTransaction();
        try {
            const sql = "select * from animal";
            connection.query(sql, function(error, results, fields){
                return res.status(200).send(results);
            });
            connection.commit();
        } catch (error) {
            connection.rollback();
            throw new Error("Não foi possivel concluir a transação", 500);
        }finally{
            connection.end();
        }
    }

    
    static getAnimalById(req, res){
        const id = req.params.id;
        const connection = CadAnimal.connect();
        connection.beginTransaction();
        try {
            const sql = `CALL spDadosAnimal(?)`;
            connection.query(sql, [id], function(error, results, fields){
                return res.status(200).send(results[0]);
             })
             connection.commit();
        } catch (error) {
            connection.rollback();
            throw new Error("Erro com servidor", 500)
        }finally{
            connection.end();
        }
    }

    static createAnimal(req, res){
        const animalInfo = req.body;
        const connection = CadAnimal.connect();

        connection.beginTransaction()
        try {
            const {nome, idade, porte, sexo, especie, data_resgate, nome_resgatante} = animalInfo;
            const parameters = [nome, idade, porte, sexo, especie, data_resgate, nome_resgatante];
        
            const sql = `CALL spCadAnimal(?,?,?,?,?,?,?)`; 

            connection.query(sql, parameters, function(){
                return res.status(200).send({msg:"Animal cadastrado com sucesso"});
             });
             connection.commit()
        } catch (error) {
            connection.rollback()
            throw new Error("Erro com servidor", 500)
        }finally{
            connection.end();
        }
    }

    static deleteAnimalById(req, res){
        const connection = CadAnimal.connect();
        const id = req.params.id;
        connection.beginTransaction();
        try {
            const sql = `DELETE FROM animal where id = ${id}`;
            connection.query(sql, function(){
                return res.status(200).send({msg:"Animal deletado com sucesso!"});
             })
             connection.commit();
        } catch (error) {
            connection.rollback();
            throw new Error("Erro com servidor", 500)
        }finally{
            connection.end();
        }
    }

    static updateAdotante(req, res){
        const connection = Adotante.connect();
        const cpf = req.params.cpf;
        const {nome, sobrenome, rua, cidade, estado, nCasa, telefone} = req.body;

        try {
            const setStatementCollumns = [] //copiei da Round, gostei.

            if(nome){
                setStatementCollumns.push(`nome = '${nome}'`)
            }
            if(sobrenome){
                setStatementCollumns.push(`sobrenome = '${sobrenome}'`)
            }
            if (rua) {
                setStatementCollumns.push(`rua = '${rua}'`)
            }
            if(cidade){
                setStatementCollumns.push(`cidade = '${cidade}'`)
            }if(estado){
                setStatementCollumns.push(`estado = '${estado}'`)
            }if(nCasa){
                setStatementCollumns.push(`nCasa = ${nCasa}`)
            }if(telefone){
                setStatementCollumns.push(`telefone = '${telefone}'`)
            }

            const sql = `UPDATE adotante SET ${setStatementCollumns.join(",")} where cpf = ${cpf}`;
            connection.query(sql, function(){
                return res.status(200).send({msg:"Atualizado com sucesso!"});
            })
            connection.commit()
        } catch (error) {
            connection.rollback();
            throw new Error("Erro no servidor", 500);
        }finally{
            connection.end();
        }         
    }
}

module.exports = CadAnimal;