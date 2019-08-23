/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

const express=require('express');
const mysql=require('mysql');
const bodyParser=require('body-parser');
const app=express();
app.use(bodyParser.urlencoded({extended:true}));

var db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"zoo",
    port:"3306"
});

app.get('/',function(req,res){
    var query="SELECT * FROM zoo";
    if ("fields" in req.query) {         
        query = query.replace("*", req.query["fields"]);    
    } 
    db.query(query,function(err,result,fields){
        if(err) throw err;
        
        var response={"page":"home","result":result};
        res.send(JSON.stringify(response));
    });
});


app.get('/animals',function(req,res){
    var query="SELECT animals.*,cage.name FROM animals INNER JOIN cage ON animals.id_cage=cage.id";
    if("sort" in req.query){
        var sort=req.query["sort"].split(",");
        query+=" ORDER BY animals.id ";
        
        for (var index in sort){
            var direction=sort[index].substr(0,1);
            
            if(direction=="-"){
                query+=" DESC,";
            }else{
                query+=" ASC,";
            }
            
            query=query.slice(0,-1);
        }
    }
    db.query(query,function(err,result,fields){
        if(err) throw err;
        
        res.send(JSON.stringify(result));
    });
});

app.post('/animals',function(req,res){
    var id=req.body.id;
    var name=req.body.name;
    var breed=req.body.breed;
    var food_per_day=req.body.food_per_day;
    var birthday=req.body.birthday;
    var entry_date=req.body.entry_date;
    var id_cage=req.body.id_cage;
    var query="INSERT INTO animals (id, name, breed, food_per_day,birthday,entry_date,id_cage) VALUES ("+id+
            ",'"+name+"','"+breed+"',"+food_per_day+",'"+birthday+"','"+entry_date+"',"+id_cage+")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        
        res.send(JSON.stringify("Success"));
    })
});

app.post('/cages',function(req,res){
    var id=req.body.id;
    var name=req.body.name;
    var description=req.body.description;
    var area=req.body.area;
    var query="INSERT INTO cage (id, name, description, area) VALUES ("+id+
            ",'"+name+"','"+description+"',"+area+")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        
        res.send(JSON.stringify("Success"));
    })
});

app.get('/cages',function(req,res){
    var query="SELECT * FROM cage";
    if ("fields" in req.query) {         
        query = query.replace("*", req.query["fields"]);    
    } 
    db.query(query,function(err,result,fields){
        if(err) throw err;
        
        res.send(JSON.stringify(result));
    })
});

app.put('/cages/:id',function(req,res){
    var id=req.params.id;
    var name=req.body.name;
    var description=req.body.description;
    var area=req.body.area;
    var query="UPDATE cage SET name='"+name+"', description='"+description+"', area="+area+" WHERE id="+id;
    db.query(query,function(err,result,fields){
        if (err) throw err;
        
        res.send(JSON.stringify(result));
    });
});

app.delete('/cages/:id',function(req,res){
    var id=req.params.id;
    var query="DELETE FROM cage WHERE id="+id;
    db.query(query,function(err,result,fields){
        if (err) throw err;
        
        res.send(JSON.stringify("Success"));
    });
});

app.post('/food',function(req,res){
    var id=req.body.id;
    var name=req.body.name;
    var id_animal=req.body.id_animal;
    var quantity=req.body.quantity;
    var query="INSERT INTO food (id, name, id_animal, quantity) VALUES ("+id+
            ",'"+name+"',"+id_animal+","+quantity+")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        
        res.send(JSON.stringify("Success"));
    })
});

app.get('/food',function(req,res){
    var query="SELECT food.*, animals.name FROM food INNER JOIN animals ON food.id_animal=animals.id";
    if("sort" in req.query){
        var sort=req.query["sort"].split(",");
        query+=" ORDER BY food.id ";
        
        for (var index in sort){
            var direction=sort[index].substr(0,1);
            
            if(direction=="-"){
                query+=" DESC,";
            }else{
                query+=" ASC,";
            }
            query=query.slice(0,-1);
        }
    }
    db.query(query,function(err,result,fields){
        if(err) throw err;
        
        res.send(JSON.stringify(result));
    })
});

app.get('/food/:id',function(req,res){
    var id=req.body.id;
    var query="SELECT * FROM food WHERE id="+id;
    if ("fields" in req.query) {         
        query = query.replace("*", req.query["fields"]);    
    } 
    db.query(query,function(err,result,fields){
        if (err) throw err;
        res.send(JSON.stringify(result));
    })
})

app.put('/food/:id',function(req,res){
    var id=req.body.id;
    var name=req.body.name;
    var id_animal=req.body.id_animal;
    var quantity=req.body.quantity;
    var query="UPDATE food SET name='"+name+"', id_animal="+id_animal+", quantity="+quantity+" WHERE id="+id;
    db.query(query,function(err,result,fields){
        if (err) throw err;
        
        res.send(JSON.stringify(result));
    });
});

app.post('/staff',function(req,res){
    var id=req.body.id;
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var wage=req.body.wage;
    var query="INSERT INTO staff (id, firstname, lastname, wage) VALUES ("+id+
            ",'"+firstname+"','"+lastname+"',"+wage+")";
    db.query(query,function(err,result,fields){
        if(err) throw err;
        
        res.send(JSON.stringify("Success"));
    })
});

app.get('/staff/:id',function(req,res){
    var query="SELECT * FROM staff WHERE id="+req.params.id;
    if ("fields" in req.query) {         
        query = query.replace("*", req.query["fields"]);    
    } 
    db.query(query,function(err,result,fields){
        if(err) throw err;
        
        res.send(JSON.stringify(result));
    })
});

app.delete('/staff/:id',function(req,res){
    var id=req.params.id;
    var query="DELETE FROM staff WHERE id="+id;
    db.query(query,function(err,result,fields){
        if (err) throw err;
        
        res.send(JSON.stringify("Success"));
    });
});

app.get('/food-stats',function(req,res){
    var query="SELECT COUNT(*) AS num FROM animals";
    db.query(query,function(err,result,fields){
        if (err) throw err;
    });
    
    for(var i=0;i<rows[0].num;i++){
        var query="SELECT animals.id, animals.food_per_day, SUM(food.quantity) AS cal FROM animals INNER JOIN food ON animals.id="+(i+1);
        db.query(query,function(err,result,fields){
            if (err) throw err;
        });
        var days_left=Integer.valueOf(rows[2].cal/rows[1].cal);
        res.write("{id: "+rows[0].cal+", days_left: "+days_left+"}\n");
    } 
});



app.listen(3000,function(){
    db.connect(function(err){
        if(err) throw err;
        console.log('Connection to database successful!');
    });
    
    console.log('Example app listening on port 3000!');
})