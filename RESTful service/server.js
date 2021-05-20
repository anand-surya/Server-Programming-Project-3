var express = require("express");
var bl = require("./businessLayer.js");
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

var DataLayer = require("./companydata/index.js");
var dl = new DataLayer("ar6234");
// var response;
app.delete('/CompanyServices/company', function(req, res){

    var company = req.query.company;
    var result = dl.deleteCompany(company);
    if(result > 0){
        response = {  
            success: company +"'s information deleted." 
        }
    }
    else{
        response = {
            error:"No company found for the given name"
        }
    }
    res.send(JSON.stringify(response));
});

app.get('/CompanyServices/department', function(req, res){

    var company = req.query.company;
    var dept_id = parseInt(req.query.dept_id);
    if(bl.checkCompany(company)){
    var dept = dl.getDepartment(company, dept_id);
    if(dept != null){
    response = {
        dept_id: dept.getId(),
        company:dept.getCompany(),
        dept_name:dept.getDeptName(),
        dept_no:dept.getDeptNo(),
        location:dept.getLocation()
    };
    } else{
        response = {
            error: "No department found for the given dept_id"
        }
    }   
    }else{
        response = {
            error: "Company name is wrong"
        }
    }
    res.send(JSON.stringify(response));
});

app.get('/CompanyServices/departments', function(req, res){

    var company = req.query.company;
    if(bl.checkCompany(company)){
        var depts = dl.getAllDepartment(company);
        var list = [];
        if(depts.length > 0){
        for(d of depts){
            dept = {
                dept_id: d.getId(),
                company: d.getCompany(),
                dept_name: d.getDeptName(),
                dept_no: d.getDeptNo(),
                location: d.getLocation() 
            }
            list.push(dept);
        }
        response = list;
    } else{
        response = {
            error: "No Department found"
        }
    }
    } else{
        response = {
            error: "Company name is wrong"
        }
    }
    res.send(JSON.stringify(response));
});

app.put('/CompanyServices/department', function(req, res){

    var company = req.body.company;
    var dept_id = parseInt(req.body.dept_id);
    var dept_name = req.body.dept_name;
    var dept_no = req.body.dept_no;
    var location = req.body.location;

   if(bl.checkCompany(company)){
        if(bl.checkDeptNo(dept_no,dept_id) == 1){
            if(bl.checkDeptId(dept_id) == 0){

                var dept  = dl.getDepartment(company, dept_id);
                dept.setDeptName(dept_name);
                dept.setDeptNo(dept_no);
                dept.setLocation(location);
                var dept = dl.updateDepartment(dept);
                response = {
                    success: {
                        dept_id:dept.getId(),
                        company:dept.getCompany(),
                        dept_name:dept.getDeptName(),
                        dept_no:dept.getDeptNo(),
                        location:dept.getLocation()
                    }
                };
            } else{
                response = {
                    error: "Department not found for the given dept_id"
                }
            }
        } else{
            response = {
                error: "Departmnet no exists. Try different dept_no"
            }
        }
   }
   else{
       response = {
           error: "Company name is wrong"
       }
   }
  
    console.log(req.body);
    res.send(JSON.stringify(response));
});

app.post('/CompanyServices/department', function(req, res){

    var company = req.body.company;
    var dept_name = req.body.dept_name;
    var dept_no = req.body.dept_no;
    var location = req.body.location;

    if(req.method = "POST"){
        console.log(JSON.stringify(req.body) + "----------");
    }
    console.log(req.body.dept_no);
    if(bl.checkCompany(company)){
        if(bl.checkDeptNo(dept_no,0) == 1){

            var dept = new dl.Department(company, dept_name, dept_no, location);
            dept = dl.insertDepartment(dept);
            if(dept.getId() > 0){
                response = {
                    success: {
                        dept_id:dept.getId(),
                        company:dept.getCompany(),
                        dept_name:dept.getDeptName(),
                        dept_no:dept.getDeptNo(),
                        location:dept.getLocation()
                    }
                };
            } else{
                response = {
                    error: "Insert Failed"
                }
            }
        } else{
            response = {
                error: "Department no exists. Try different dept_no"
            }
        }
    } else{
        response = {
            error: "Company name is wrong"
        }
    }

    res.send(JSON.stringify(response));
});

app.delete('/CompanyServices/department', function(req, res){

    var company = req.query.company;
    var dept_id = parseInt(req.query.dept_id);

    if(bl.checkCompany(company)){
        var result = dl.deleteDepartment(company, dept_id);
        if(result > 0){
            response = {
                success: "Department " + dept_id + " from "+company+" deleted"
            };
        }
        else{
            response = {
                error: "No department found for the given dept_id"
            };
        }
    }
    else{
        response = {
            error: "Company name is wrong"
        };
    }

    res.send(JSON.stringify(response));
});

app.get('/CompanyServices/employee', function(req, res){

    var company = req.query.company;
    var emp_id = parseInt(req.query.emp_id);

    if(bl.checkCompany(company)){
        var emp = dl.getEmployee(emp_id);
        if(emp != null){
        response = {
            emp_id: emp.getId(),
            emp_name: emp.getEmpName(),
            emp_no: emp.getEmpNo(),
            hire_date: emp.getHireDate(),
            job: emp.getJob(),
            salary: emp.getSalary(),
            dept_id: emp.getDeptId(),
            mng_id: emp.getMngId() 
        };
        } else{
            response = {
                error: "No Employee found for the given emp_id"
            }
        }
    } else{
        response = {
            error: "Company name is wrong"
        }
    }

    res.send(JSON.stringify(response));
});

app.get('/CompanyServices/employees', function(req, res){

    var company = req.query.company;

    if(bl.checkCompany(company)){

        var emps = dl.getAllEmployee(company);
        var list = [];
        if(emps.length > 0){
        for(e of emps){
            emp = {
                emp_id:e.getId(),
                emp_name:e.getEmpName(),
                emp_no:e.getEmpNo(),
                hire_date:e.getHireDate(),
                job:e.getJob(),
                salary:e.getSalary(),
                dept_id:e.getDeptId(),
                mng_id:e.getMngId() 
            }
            list.push(emp);
        }
        response = list;
    } else{
        response = {
            error: "No Employees found for this company"
        }
    }
    } else{
        response = {
            error: "Company name is wrong"
        }
    }
    res.send(JSON.stringify(response));
});

app.post('/CompanyServices/employee', function(req, res){

    var company = req.body.company;
    var emp_name = req.body.emp_name;
    var emp_no = req.body.emp_no;
    var hire_date = req.body.hire_date;
    var job = req.body.job;
    var salary = parseFloat(req.body.salary);
    var dept_id = parseInt(req.body.dept_id);
    var mng_id = parseInt(req.body.mng_id);

    console.log(req.body);
    var dateCheck = bl.checkEmpHire(hire_date);
    if(bl.checkEmp(mng_id) == 1){
        mng_id = 0;
    }
    if(bl.checkCompany(company)){
        if(bl.checkDeptId(dept_id) == 0){
            if(bl.checkEmpNo(emp_no, 0, 0) == 0){
                if(dateCheck == null){
                    var emp = new dl.Employee(emp_name, emp_no, hire_date, job, salary, dept_id, mng_id);
                    emp = dl.insertEmployee(emp);
                    if(emp.getId() > 0){
                        response = {
                            success:{
                                    emp_id:emp.getId(),
                                    emp_name:emp.getEmpName(),
                                    emp_no:emp.getEmpNo(),
                                    hire_date:emp.getHireDate(),
                                    job:emp.getJob(),
                                    salary:emp.getSalary(),
                                    dept_id:emp.getDeptId(),
                                    mng_id:emp.getMngId()
                                }
                        };
                    }
                } else {
                    response = {
                        error: dateCheck
                    };
                }
            } else{
                response = {
                    error: "Employee no exists. Try different emp_no"
                }
            }
        } else{
            response = {
                error: "No department found for the given dept_id"
            }
        }
    } else{
        response = {
            error: "Company name is wrong"
        }
    }
    res.send(JSON.stringify(response));
});

app.put('/CompanyServices/employee', function(req, res){

    var company = req.body.company;
    var emp_id = parseInt(req.body.emp_id);
    var emp_name = req.body.emp_name;
    var emp_no = req.body.emp_no;
    var hire_date = req.body.hire_date;
    var job = req.body.job;
    var salary = parseFloat(req.body.salary);
    var dept_id = parseInt(req.body.dept_id);
    var mng_id = parseInt(req.body.mng_id);

    console.log(req.body);
    var dateCheck = bl.checkEmpHire(hire_date);
    if(bl.checkEmp(mng_id) == 1){
        mng_id = 0;
    }
    if(bl.checkCompany(company)){
        if(bl.checkDeptId(dept_id) == 0){
            if(bl.checkEmp(emp_id) == 0){
                if(bl.checkEmpNo(emp_no, 1, emp_id) == 0){
                    if(dateCheck == null){
                        var emp = dl.getEmployee(emp_id);
                        emp.setEmpName(emp_name);
                        emp.setEmpNo(emp_no);
                        emp.setHireDate(hire_date);
                        emp.setJob(job);
                        emp.setSalary(salary);
                        emp.setDeptId(dept_id);
                        emp.setMngId(mng_id);
                        emp = dl.updateEmployee(emp);
                        if(emp.getId() > 0){
                            response = {
                                success:{
                                        emp_id:emp.getId(),
                                        emp_name:emp.getEmpName(),
                                        emp_no:emp.getEmpNo(),
                                        hire_date:emp.getHireDate(),
                                        job:emp.getJob(),
                                        salary:emp.getSalary(),
                                        dept_id:emp.getDeptId(),
                                        mng_id:emp.getMngId()
                                    }
                            };
                        }
                    } else {
                        response = {
                            error: dateCheck
                        };
                    }
                } else{
                    response = {
                        error: "Employee no exists. Try different emp_no"
                    }
                }
            } else{
                response = {
                    error: "No Employee found for the given emp_id"
                }
            }
        } else{
            response = {
                error: "No department found for the given dept_id"
            }
        }
    } else{
        response = {
            error: "Company name is wrong"
        }
    }
    res.send(JSON.stringify(response));
});

app.delete('/CompanyServices/employee', function(req, res){

    var company = req.query.company;
    var emp_id = parseInt(req.query.emp_id);

    if(bl.checkCompany(company)){

        var result = dl.deleteEmployee(emp_id);
        if(result > 0){
            response = {
                success: "Employee " + emp_id + " deleted." 
            };
        } else{
            response = {
                error: "No Employee found for the given emp_id"
            };
        }
    } else{
        response = {
            error: "Company name is wrong"
        };
    }
    res.send(JSON.stringify(response));
});

app.get('/CompanyServices/timecard', function(req, res){

    var company = req.query.company;
    var timecard_id = parseInt(req.query.timecard_id);

    if(bl.checkCompany(company)){

        var tc = dl.getTimecard(timecard_id);
        if(tc != null){
            response = {
                timecard_id:tc.getId(),
                start_time:tc.getStartTime(),
                end_time:tc.getEndTime(),
                emp_id:tc.getEmpId()
            };
        } else{
            response = {
                error: "No Timecard found for the given timecard_id"
            };
        }
    } else{
        response = {
            error: "Company name is wrong"
        }
    }
    res.send(JSON.stringify(response));
});

app.get('/CompanyServices/timecards', function(req, res){

    var company = req.query.company;
    var emp_id = parseInt(req.query.emp_id);

    if(bl.checkCompany(company)){

        var timecards = dl.getAllTimecard(emp_id);
        var list = [];
        if(timecards.length > 0){
            for(tc of timecards){
                time = {
                    timecard_id:tc.getId(),
                    start_time:tc.getStartTime(),
                    end_time:tc.getEndTime(),
                    emp_id:tc.getEmpId()
                };
                list.push(time);
            }
            response = list;
        } else{
            response = {
                error: "No timecards found for the given emp_id"
            }
        }

    } else{
        response = {
            error: "Company name is wrong"
        }
    }

    res.send(JSON.stringify(response));
});

app.post('/CompanyServices/timecard', function(req, res){

    var company = req.body.company;
    var emp_id = parseInt(req.body.emp_id);
    var start_time = req.body.start_time;
    var end_time = req.body.end_time;
   console.log(req.body);
    var result = bl.checkTimecardDate(start_time, end_time);
    var result1 = bl.checkOtherTimecard(start_time, emp_id, 0); 

    if(bl.checkCompany(company)){
        if(bl.checkEmp(emp_id) == 0){
            if(result == null){
                if( result1 == 1 || result1 == null){
                    var timecard = new dl.Timecard(start_time, end_time, emp_id);
                    timecard = dl.insertTimecard(timecard);
                    if(timecard != null){
                        response = {
                            success:
                                {
                                    timecard_id:timecard.getId(),
                                    start_time:timecard.getStartTime(),
                                    end_time:timecard.getEndTime(),
                                    emp_id:timecard.getEmpId()
                                }
                        }
                    } else{
                        response = {
                            error: "Insert failed. Try again"
                        }
                    }
                } else{
                    response = {
                        error: "Start time must not be on the same day as other start time"
                    }
                }
            } else {
                response = {
                    error: result
                }
            }
        } else{
            response = {
                error: "No Employee found for the given emp_id"
            }
        }
    } else{
        response = {
            error: "Company name is wrong"
        }
    }
    res.send(JSON.stringify(response));
});

app.put('/CompanyServices/timecard', function(req, res){

    var company = req.body.company;
    var timecard_id = req.body.timecard_id;
    var start_time = req.body.start_time;
    var end_time = req.body.end_time;
    var emp_id = req.body.emp_id;

    var result = bl.checkTimecardDate(start_time, end_time);
    var result1 = bl.checkOtherTimecard(start_time, emp_id, timecard_id); 

    if(bl.checkCompany(company)){
        if(bl.checkEmp(emp_id) == 0){
            if(bl.checkTimeId(timecard_id) == 0){
                if(result == null){
                    if( result1 == 1 || result1 == null){
                        var timecard = dl.getTimecard(timecard_id);
                        timecard.setStartTime(start_time);
                        timecard.setEndTime(end_time);
                        timecard.setEmpId(emp_id);
                        timecard = dl.updateTimecard(timecard);   
                        if(timecard != null){
                            response = {
                                success:
                                    {
                                        timecard_id:timecard.getId(),
                                        start_time:timecard.getStartTime(),
                                        end_time:timecard.getEndTime(),
                                        emp_id:timecard.getEmpId()
                                    }
                            }
                        } else{
                            response = {
                                error: "Insert failed. Try again"
                            }
                        }
                    } else{
                        response = {
                            error: "Start time must not be on the same day as other start time"
                        }
                    }
                } else {
                    response = {
                        error: result
                    }
                }
            } else{
                response = {
                    error: "No Timecard found for the given timecard_id"
                }
            }
        } else{
            response = {
                error: "No Employee found for the given emp_id"
            }
        }
    } else{
        response = {
            error: "Company name is wrong"
        }
    }


    res.send(JSON.stringify(response));
});

app.delete('/CompanyServices/timecard', function(req, res){

    var company = req.query.company;
    var timecard_id = parseInt(req.query.timecard_id);

    if(bl.checkCompany(company)){
        var result = dl.deleteTimecard(timecard_id);
        if(result > 0){
            response = {
                success: "Timecard "+timecard_id+" deleted."
            }
        } else{
            response = {
                error: "No Timecard found for the given timecard_id"
            }
        }
    } else{
        response = {
            error: "Company name is wrong"
        }
    } 
    res.send(JSON.stringify(response));
});

var server = app.listen(8080, function(){
    console.log("server running");
    var host = server.address().address;
    var port = server.address().port;
    console.log("%s:%s",host, port);
});