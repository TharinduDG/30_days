

    var bmiDB = {}
    bmiDB.init = {}
    bmiDB.init.db = {}

    // Holding database inistance inside a global variable
    bmiDB.init.open = function(){
        bmiDB.init.db = openDatabase("bmiData","1.0","BMI Data Collection",5 * 1024 * 1024);
    }

    bmiDB.init.createTable = function(){
        var database = bmiDB.init.db;
        database.transaction(function(tx){
            tx.executeSql("CREATE TABLE IF NOT EXISTS bmiTable (ID INTEGER PRIMARY KEY ASC,bmi_value TEXT, health_state TEXT,date VARCHAR)", []);
        });
    }

    // adding created bmi
    bmiDB.init.addBmiData = function(date,bmi_value,health_state){
        var database = bmiDB.init.db;
        database.transaction(function(tx){
            tx.executeSql("INSERT INTO bmiTable (bmi_value,health_state,date) VALUES (?,?,?)", [bmi_value,health_state,date]);
        });
    }


    // getting created bmi
    bmiDB.init.getBmiData = function(){
        var database = bmiDB.init.db;
        var output = '';
        database.transaction(function(tx){
            tx.executeSql("SELECT * FROM bmiTable order by ID desc", [], function(tx,result){
                for (var i=0; i < result.rows.length; i++) {
                   var  bmi_val = result.rows.item(i).bmi_value;
                   var  state = result.rows.item(i).health_state;
                   var  date_val = result.rows.item(i).date;
                    viewData(date_val,bmi_val,state);
                }
            });
        });
    }

    // deleting  bmiTable data
    bmiDB.init.deleteBmi = function(){
        var database = bmiDB.init.db;
        database.transaction(function(tx){
            tx.executeSql("DROP TABLE bmiTable",[]);
        });
    }



    // function to show all todos 
    function viewData(date,bmi_value,health_state){
        $('#bmiTbl').append('<tr><td>'+ date+'</td>' + '<td>'+bmi_value+'</td>' + '<td>'+health_state+'</td></tr>');
    }


    function init(){
        if(typeof(openDatabase) !== 'undefined')
        {
            bmiDB.init.open();
            bmiDB.init.createTable();
        }
    }
    init();

