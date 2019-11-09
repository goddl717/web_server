var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

var pool = mysql.createPool({
   connectionLimit :10,
    host : 'localhost',
    user : 'root',
    password : 'eorn',
    port : 3306,
    database : 'lab'
})

var authDiag = function(date,callback){
    console.log('authDiag 호출됨');

    pool.getConnection(function(err,conn){
        if(err){
        {
            if(conn){
                conn.release();
            }
        }
        callback(err,null);
        return;   

        }

    console.log('데이터베이스 연결 스레드 아이디 : ',conn.threadId);
/*
    var columns = ['hospital_name','hospital_id','diagnosis_date'];
    var tablename = 'hospital_info left join diagnosis_info on hospital_info.hospital_id = diagnosis_info.dia_id';
*/
var columns = ['hospital_name','hospital_id'];
var tablename = 'hospital_info';


        var exec = conn.query("select hospital_name from hospital_info join diagnosis_info on hospital_info.hospital_id = diagnosis_info.dia_id where diagnosis_date = ? ",[date],function(err,rows){
        

        conn.release();
        console.log('실행대상 SQL :'+exec.sql);

        if(rows.length > 0){
            console.log('일치하는 병원이 있음'+date);
            callback(null,rows);
        }
        else {
            console.log('일치하는 병원를 찾지 못함');
            callback(null,null);
        }
    });

} 
)};

//이름이랑 날짜를 받아서 확인하는 것.
//이건 필요가 없는듯 
app.post('/check',function(req,res){
    console.log('check 호출됨');

    var paraDate = req.body.date1 || req.query.date1;
    
    console.log('요청된 파라미터 : '+ paraDate);

    if (pool){
        authDiag(paraDate,function(err,rows){
            if (err)
            {
                console.log('파라미터 입력시 오류'+err.stact);
                res.send({state:0});
                res.end();
                return;
            }
            if(rows){
                console.dir(rows);
               // var username = rows[0].hospital_name;
                //var username1 = rows[1].hospital_name;
                //console.log(username);
                //console.log(username1)
               
                res.send(rows); 
                res.end();
            }
            else {
                res.send([{"state" :"0"}]);
                res.end();

            }
        })
    }
})





var selectAll = function(callback){
    console.log('selectAll 호출됨');

    pool.getConnection(function(err,conn){
        if(err){
        {
            if(conn){
                conn.release();
            }
        }
        callback(err,null);
        return;   
        }

    console.log('데이터베이스 연결 스레드 아이디 : ',conn.threadId);

    var exec = conn.query("select * from hospital_info",function(err,rows){
        
        conn.release();
        console.log('실행대상 SQL :'+exec.sql);

        if(rows.length > 0){
            console.log('병원정보가 있음');
            callback(null,rows);
        }
        else {
            console.log('병원정보가 없음');
            callback(null,null);
        }
    });

} 
)};




app.post('/selectAll',function(req,res){
    console.log('selectAll 호출됨');


    if (pool){
        selectAll(function(err,rows){
            if (err)
            {
                console.log('파라미터 입력시 오류'+err.stact);
                res.send("1");
                res.end();
                return;
            }
            if(rows){
                console.dir(rows);
                res.send(rows); 
                res.end();
            }
            else {
                res.send([{"state" :"0"}]);
                res.end();

            }
        })
    }
})



//날짜를 받아서 가능한 병원을 출력.




app.listen(8080,function(){
    console.log('listening 8080!');
})
