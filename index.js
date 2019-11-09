var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var app = express();
app.use(bodyParser.urlencoded({extended: false}));

var userRouter = require('./user');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'eorn',
    port : 3306,
    database : 'hang'
})
connection.connect();
app.use('/user',userRouter);

app.post('/login',function(req,res){
   // var temp ='SELECT * FROM user1;';
   var flag = -1;
  
   var temp ='SELECT * FROM user1 where user_id ="'+req.body.id+'";';
   console.log (temp);

        connection.query(temp, function (error, results, fields) {
        if (error) {
            console.log(error);
        }
        else{
            console.log(results);
            console.log(JSON.stringify(results));

            if (JSON.stringify(results) === "[]"){
                console.log('have no id information');
                flag = 0;
                res.send('have no id information');
               
                let check = [
                    {
                        permission : 2 
                    }
                ]

                res.json(check);
                
                //res.end();

            }
            else {
                console.log('check id and password'); 

                var string = JSON.stringify(results);
                console.log(string); 
                var json =  JSON.parse(string);
                console.log('user_id :'+json[0].user_id); 
              //  console.log(req.body.id);
               // console.log(req.body.password);
               // console.log(results.user_id);
              //  console.log(results.user_password);

                if (json[0].user_id===req.body.id && json[0].user_password === req.body.password)
                    {
                    console.log('can access!');
                    flag = 1;
                    res.send('can access!');

                    let check = [
                        {
                            permission : 1 
                        }
                    ]

                    res.json(check);

                    }
                    else {
                        flag = 2;
                        //json 파일 생성후 전송.
                        let check = [
                            {
                                permission : 0 
                            }
                        ]
                        res.json(check);
                        console.log('cant access!');
                        res.send('cant access!');
                        
                     }    
                }     
         }
        }
    );
  // console.log("asdf");
   // res.writeHead(200, {'Content-Type':'text/html'});
   // res.status(200);

  //  res.send('--------');
   // res.end();

});



app.post('/signup',function(req,res){
    //post 값을 받아서 
    var temp ='insert into user1(user_name,user_id,user_password,user_age,user_sex) values( '+'"'+req.body.name+'","'+req.body.id+'","'+req.body.password+'","'+req.body.age+'","'+req.body.sex+'");';

    console.log(temp);
    connection.query(temp, function (error, results, fields) {
        if (error) {
            console.log(error);
            console.log('중복된 아이디 입니다!');
            res.send('already have!');
        }
        else{
            console.log('회원가입이 완료 되었습니다');  
            res.send('complete!'); 
    } 
    })
 

    
});





app.listen(8080,function(){
    console.log('listening 8000!');
})

