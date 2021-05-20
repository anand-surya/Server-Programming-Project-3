const datefns = require("date-fns");
const differenceInHours = require("date-fns/difference_in_hours");
const differenceInWeeks = require("date-fns/difference_in_weeks");
var DataLayer = require("./companydata/index.js");
var dl = new DataLayer("ar6234");
var comp = "ar6234"

function checkCompany(company){
    if(company == "ar6234"){
        return true;
    }
    else{
        return false;
    }
}

function checkDeptNo(dept_no, dept_id){
    var depts = dl.getAllDepartment(comp);
    console.log(dept_no);
    var list = [];
    for (d of depts){
        list.push(d.getDeptNo());
    }
    if(dept_id == 0){
        if(list.includes(dept_no)){
            return 0;
        }
        else{
            return 1;
        }
    } else {
        for( d of depts){
            console.log(d.getDeptNo());
            if(d.getDeptNo() == dept_no && d.getId() == dept_id){
                return 1;
            } else if(d.getDeptNo() == dept_no && d.getId() != dept_id){
                return 0;
            } else {
                 return 1;
            }
        }
    }
    
}

function checkDeptId(dept_id){
    var depts = dl.getAllDepartment(comp);
    var list = [];
    for (d of depts){
        list.push(d.getId());
    }
    if(list.includes(dept_id)){
        return 0;
    }
    else{
        return 1;
    }
}

function checkEmp(emp_id){
    var emps = dl.getAllEmployee(comp);
    var list = [];
    for (e of emps){
        list.push(e.getId());
    }
    if(list.includes(emp_id)){
        return 0;
    } 
    else{
        return 1;
    }
}

function checkEmpNo(emp_no, method, emp_id){
    var emps = dl.getAllEmployee(comp);
    console.log("entered");
    var list = [];
    for (e of emps){
        if(method == 0){
            if(e.getEmpNo().localeCompare(emp_no) == 0){
                return 1;
            }
        }
        if(method == 1){
            if((e.getEmpNo().localeCompare(emp_no) == 0) && e.getId() != emp_id){
                return 1;
            }
        }
    }
    return 0;
}


function checkEmpHire(hire_date){
    var date = new Date(hire_date);
    var now = new Date();
    console.log(date + "--");
    console.log(now);

    if(datefns.isValid(date)){
        if(datefns.isBefore(date, now) || datefns.isEqual(date,now)){
            console.log("before");
        } else{
            console.log("after");
            return "Hire date must be current or earlier date";
        }
        if(datefns.isWeekend(hire_date)){
            
            console.log("weekend"+ hire_date);
            return "Hire date cannot not be Saturday or Sunday";
        }
    } else{
        console.log("invalid date entered");
        return "Invalid date";
    }
    return null;
}

function checkTimecardDate(start_date, end_date){

    var sDate = new Date(start_date);
    var eDate = new Date(end_date);
    var now = new Date();
    var st = new Date();
    st = datefns.setHours(st, 8);
    st = datefns.setMinutes(st, 0);
    st = datefns.setSeconds(st, 00);
    var ed = new Date();
    ed = datefns.setHours(ed, 18);
    ed = datefns.setMinutes(ed, 0);
    ed = datefns.setSeconds(ed, 00);
    console.log(ed + "asdbkjdfbakjbdf");
    console.log(sDate + "--" + eDate);
    console.log(now);
    console.log(datefns.getHours(sDate) - datefns.getHours(st));
    console.log(datefns.getHours(ed) - datefns.getHours(sDate));

    if(datefns.isValid(sDate) && datefns.isValid(eDate)){
        if(datefns.isBefore(sDate, now) || datefns.isEqual(sDate,now)){
            console.log("before");
        } else{
            console.log("after");
            return "Start date must be current or earlier date";
        }
        if(datefns.isWeekend(start_date)){
            
            console.log("weekend"+ start_date);
            return "Start date cannot not be Saturday or Sunday";
        }
        if(differenceInWeeks(now, sDate)  > 0){
            console.log("must be within a week from today");
            return "Start date must be within a week from today";
        } 
        if(datefns.isSameDay(sDate, eDate) == true){
    
            if(((datefns.getHours(sDate) - datefns.getHours(st)) < 0 ) || (datefns.getHours(ed) - datefns.getHours(sDate)) <= 0){
                return "Start Date must be within 8:00:00 and 18:00:00";
            }  
            if(((datefns.getHours(eDate) - datefns.getHours(st)) < 0 ) || (datefns.getHours(ed) - datefns.getHours(eDate)) <= 0){
                return "End Date must be within 8:00:00 and 18:00:00";
            } 
            if(differenceInHours(eDate, sDate) < 1){
                return "End Date must be at least 1 hour greater than start time";
            }
        } else{
            return "Start date and End date must be on the same day";
        }
    } else{
        console.log("invalid date entered");
        return "Invalid date";
    }
    return null;
}

function checkOtherTimecard(start_time, emp_id, timecard_id){
    console.log("Entered");
    console.log("tcid "+timecard_id);
    var date  = new Date(start_time);
    var tc = dl.getAllTimecard(emp_id);
    if(tc.length <= 0){
        return 1;
    }
    if(timecard_id == 0){
        console.log("Entered if");
        for(t of tc){
            console.log(t.getStartTime());
            console.log(t.emp_id, emp_id);
            var tcDate = new Date(t.getStartTime());
            console.log(datefns.isSameDay(date, t.getStartTime()) );
            if(t.getEmpId() == emp_id && datefns.isSameDay(date, t.getStartTime()) == true){
                return 0;
            } 
        }
    } else{
        for(t of tc){
            var tcDate = new Date(t.getStartTime());
            if(t.getEmpId() == emp_id && datefns.isSameDay(date, tcDate) && t.getId() != timecard_id){
                return 0;
            } 
        }
    }
    return null;
}

function checkTimeId(timecard_id){

    var tc = dl.getTimecard(timecard_id);
    if(tc != null){
        return 0;
    }
    else{
        return 1;
    }    

}



module.exports = { checkCompany, checkDeptNo, checkDeptId, checkEmp, checkEmpNo, checkEmpHire, checkTimecardDate, checkOtherTimecard, checkTimeId};