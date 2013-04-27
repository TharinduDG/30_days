<script src="jquery.mobile/jquery.js" type="text/javascript"></script>

$(function() {
    var bmiDB = {}
    bmiDB.init = {}
    bmiDB.init.db = {}

    // Holding database inistance inside a global variable
    bmiDB.init.open = function(){
        bmiDB.init.db = openDatabase("bmiData","1.0","BMI Data Collection",5 * 1024 * 1024);
        // dbname, verison, desc, size
    }

    bmiDB.init.createTable = function(){
        var database = bmiDB.init.db;
        database.transaction(function(tx){
            tx.executeSql("CREATE TABLE IF NOT EXISTS bmiTable (ID INTEGER PRIMARY KEY ASC,bmi_value TEXT, health_state TEXT,date VARCHAR)", []);
        });
    }

    // adding created bmi
    bmiDB.init.addBmiData = function(bmi_value,health_state,date,time){
        var database = bmiDB.init.db;
        database.transaction(function(tx){
            tx.executeSql("INSERT INTO bmiTable (bmi_value,health_state,date) VALUES (?,?,?)", [bmi_value,health_state,date],
                showAllTodo(date,bmi_value,health_state));
        });
    }


    // getting created bmi
    bmiDB.init.getBmiData = function(){
        var database = bmiDB.init.db;
        var output = '';
        database.transaction(function(tx){
            tx.executeSql("SELECT * FROM bmiTable", [], function(tx,result){
                for (var i=0; i < result.rows.length; i++) {
                    bmi_value = result.rows.item(i).bmi_value;
                    health_state = result.rows.item(i).due_date;
                    date = result.rows.item(i).date;
                    showAllTodo(date,bmi_value,health_state);
                }
            });
        });
    }

    // deleting a bmiTable 
    bmiDB.init.deleteBmi = function(id){
        var database = bmiDB.init.db;
        database.transaction(function(tx){
            tx.executeSql("DELETE FROM bmiTable WHERE ID=?",[id]);
        });
    }


    // onclick add bmiTable event
    $('#create_todo').click(function(){
        var bmi_value_text = $('#bmi_value_text').val();
        var health_state = $('#health_state').val();

        if(bmi_value_text.length == '' || health_state.length == '')
        {
            alert('Both fields are required');
        }
        else
        {
            bmiDB.init.addTodo(bmi_value_text,health_state);
            $('#bmi_value_text').val('');
            $('#health_state').val('');
        }
    });

    // function to show all todos 
    function showAllTodo(date,bmi_value,health_state){
        $('ul.list').append(
            '<li><div class="bmi_value"><span class="bmi_value">' + bmi_value + '</span>' +
                '<a href="#" id="delete"> Delete </a><span class="due_date">' + health_state + '</span>' +
                '<input id="this_id" value="' + todo_id + '" type="hidden"><div class="clear"></div></div></li>');
        $('li:last').addClass('highlight').delay(1000).queue(function(next){ $(this).removeClass('highlight'); next(); });
    }

    // onClick deleteEvent Handler

    $('#delete').live("click",function(){
        var id = $(this).closest('li').find('#this_id').val();
        $(this).closest('li').addClass('highlight').delay(1000).queue(function(next){ $(this).remove(); next(); });
        bmiDB.init.deleteTodo(id);
    });

    function init(){
        if(typeof(openDatabase) !== 'undefined')
        {
            bmiDB.init.open();
            bmiDB.init.createTable();
            bmiDB.init.getBmiData();
        }
    }
    init();


    // Loading DatePicker
    $('#health_state').datepicker();

});