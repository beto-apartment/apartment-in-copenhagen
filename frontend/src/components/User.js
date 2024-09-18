import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
// library
import * as XLSX from 'xlsx'
// services
import userService from '../services/users'
// components
import UserSettings from './UserSettings'
// material
import { Tooltip, Table, TableHead, TableCell, TableRow, TableBody, Paper, TableContainer, ToggleButton, ToggleButtonGroup, Box, InputLabel, MenuItem, FormControl, Select, Button, useMediaQuery } from '@mui/material'

const User = ({ user, employees, onUpdateEmployees }) => {

  const [periodResume, setPeriodResume] = useState([])
  const [period, setPeriod] = useState('January/February')
  const [year, setYear] = useState(2024)
  
  const [worker, setWorker] = useState(null)
  const [hours, setHours] = useState(null)
  
  const [activeEmployees, setActiveEmployees] = useState([])
  const [onlyActiveUsers, setOnlyActiveUsers] = useState('true')

  const navigate = useNavigate()

  useEffect(() => {
    if (employees) {
      if (onlyActiveUsers === 'true') {
        const activeUsers = employees.filter(employee => employee.isActive)
        setActiveEmployees(activeUsers)
      } else {
        setActiveEmployees(employees)
      }
    }
  }, [employees, onlyActiveUsers])

  const localWorker = worker ? worker : JSON.parse(localStorage.getItem('janUserEmployee'))
  
  const handleDate = (date) => {
    return date.split("T")[0]
  }

  const copenhagenTime = (date) => {
    // Create a Date object, either from the provided date or the current date
    let dateObj = date ? new Date(date) : new Date()
    
    // Format the date to Copenhagen's time zone
    const options = {
        timeZone: 'Europe/Copenhagen',
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short'
    }

    // Convert the formatted date back into a more human-readable string
    return new Intl.DateTimeFormat('en-US', options).format(dateObj)
  }

  const filterByPeriod = () => {

    // const year = 2022
    // const month = "January/February"

    const results = activeEmployees.map(user => {
      const matchedHours = user.hours.filter(hour => {
        const hourYear = new Date(copenhagenTime(hour.date)).getFullYear()
        return hourYear === year && hour.month === period
      }).map(hour => hour.monthHours)
    
      return {
        username: user.username,
        matchedHours: matchedHours
      }
    }).filter(user => user.matchedHours.length > 0)

    // console.log(results)
    setPeriodResume(results)
  }

  const handleChangeYear = (event) => {
    setYear(event.target.value)
  }

  const handleChangePeriod = (event) => {
    setPeriod(event.target.value)
  }

  const currentYear = new Date(copenhagenTime()).getFullYear()
  const yearOptions = []
  for (let year = currentYear; year >= 2022; year--) {
    yearOptions.push({ value: year, label: year.toString() })
  }

  const periodOptions = [
    { value: 'January/February', label: 'January/February' },
    { value: 'February/March', label: 'February/March' },
    { value: 'March/April', label: 'March/April' },
    { value: 'April/May', label: 'April/May' },
    { value: 'May/June', label: 'May/June' },
    { value: 'June/July', label: 'June/July' },
    { value: 'July/August', label: 'July/August' },
    { value: 'August/September', label: 'August/September' },
    { value: 'September/October', label: 'September/October' },
    { value: 'October/November', label: 'October/November' },
    { value: 'November/December', label: 'November/December' },
    { value: 'December/January', label: 'December/January' },
  ]

  const ScreenOne = ({ user, employees }) => {
    
    // console.log(employees)


    const handleToggleActive = (event, newValue) => {
      if (newValue !== null) {
        setOnlyActiveUsers(newValue)
        if (newValue === 'true') {
          const activeUsers = employees.filter(employee => employee.isActive)
          setActiveEmployees(activeUsers)
        } else {
          setActiveEmployees(employees)
        }
      }
    }

    const isMobileScreen = useMediaQuery('(min-width: 1250px)')
    const settingsStyles = isMobileScreen ? {
      position: 'absolute',
      top: '10px',
      right: '10px',
    } : {}
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <div style={settingsStyles}>
        <UserSettings isEmployee={false} />
      </div>
      <ToggleButtonGroup
        style={{ margin: '20px 0', width: '12em' }}
        color="primary"
        value={onlyActiveUsers}
        exclusive
        onChange={handleToggleActive}
        aria-label="Platform"
      >
        <ToggleButton value="true">Only Activate Users</ToggleButton>
        <ToggleButton value="false">All users</ToggleButton>
      </ToggleButtonGroup>
      <Button variant="contained" onClick={() => handleSetPeriod()}>Period</Button>

      <Box sx={{ minWidth: 120, margin: '1em' }}>
        <FormControl  sx={{ mb: 2 }}>
          <InputLabel id="select1-label">Year</InputLabel>
          <Select
            labelId="select1-label"
            id="select1"
            value={year}
            label="Year"
            onChange={handleChangeYear}
          >
            {yearOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl >
          <InputLabel id="select2-label">Period</InputLabel>
          <Select
            labelId="select2-label"
            id="select2"
            value={period}
            label="Period"
            onChange={handleChangePeriod}
          >
            {periodOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper} sx={{ width: 'auto', marginBottom: '1em' }}>
        <Table sx={{ minWidth: 650 }} aria-label="employee table">
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Last Update</b></TableCell>
              <TableCell><b>Period</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
              <TableCell><b></b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              employees === null ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">Loading...</TableCell>
                </TableRow>
              ) : (
                activeEmployees
                  .filter(worker => worker.username !== user.username)
                  .map(employee => (
                    <TableRow key={employee.username} hover>
                      <TableCell>
                        {employee.username
                          .split(' ') // Split the username into an array of words by spaces
                          .map(word => word[0].toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter of each word
                          .join(' ') // Join the array back into a string with spaces
                        }

                      </TableCell>
                      <TableCell>
                        <Tooltip title={"YYYY-MM-DD"}>
                          <span>
                            {employee.hours.length > 0 && handleDate(employee.hours[0].date)}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        {employee.hours.length > 0 && employee.hours[0].month}
                      </TableCell>
                      <TableCell>
                        {employee.isActive ? 'Active' : 'Inactive'}
                      </TableCell>
                      <TableCell>
                        {/* Activation/Deactivation Button */}
                        {employee.isActive ? (
                          <Button variant="contained" color="error" onClick={() => onDeactivate(employee)}>Deactivate</Button>
                        ) : (
                          <Button variant="contained" color="error" onClick={() => onActivate(employee)}>Activate</Button>
                        )}
                      </TableCell>
                      <TableCell>
                        {/* View Details Button */}
                        <Button variant="contained" onClick={() => handleGetEmployee(employee)}>
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const ScreenTwo = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <h1>{localWorker.username[0].toUpperCase() + localWorker.username.slice(1).toLowerCase()}</h1>
      <Link to="/"><Button variant='contained' sx={{ marginBottom: '10px' }}>Back</Button></Link>
      <TableContainer component={Paper} sx={{ width: 'auto', marginBottom: '1em' }}>
        <Table sx={{ minWidth: 650 }} aria-label="hours table">
          <TableHead>
            <TableRow>
              <TableCell><b>Period</b></TableCell>
              <TableCell><b>Last Update</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {localWorker && localWorker.hours.length > 0 ? (
              localWorker.hours.map((hours, index) => (
                <TableRow key={index} hover>
                  <TableCell>
                    {hours.month}
                  </TableCell>
                  <TableCell>
                    {handleDate(hours.date)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='contained'
                      onClick={() => handleGetHours(hours)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">No Data Available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
const ScreenThree = ({ hours, worker }) => {
  const localHours = hours ? hours : JSON.parse(localStorage.getItem('janUserHours'))
  const localWorker = worker ? worker : JSON.parse(localStorage.getItem('janUserEmployee'))
  return (
    <div>
      <h1>{localWorker.username[0].toUpperCase() + localWorker.username.slice(1).toLowerCase()}</h1>
      <h3>{localHours.month.toUpperCase()}</h3>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1em' }}>
        <Link to={`/Jan/employee/${localWorker.username}`}><Button variant='contained' className='screenBtn'>Back</Button></Link>
        <Link to="/"><Button variant='contained' className='screenBtn'>Home</Button></Link>
      </Box>

      <div className='userTable userTableHeader'>
          <span className='headerTitle date-column'>DATE</span>
          <span className='headerTitle holiday-column'>HOLIDAY</span>
          <span className='headerTitle jobdescription'>JOB DESCRIPTION</span>
          <span className='headerTitle startA'>START</span>
          <span className='headerTitle endA'>FINISH</span>
          <span className='headerTitle startB'>START</span>
          <span className='headerTitle endB'>FINISH</span>
          <span className='headerTitle hours-min-width'>TOTAL</span>
          <span className='headerTitle hours-min-width'>NORMAL</span>
          <span className='headerTitle hours-min-width'>LATE HOURS</span>
          <span className='headerTitle hours-min-width'>HOLYDAY HOURS</span>
      </div>
      
      
      <ul className='freeWidth'>
        {
          localHours &&
          localHours.days.map((day, index) => 
            <li key={index}>
              <div className='userTable'>
                <span className='userSpan date-column'>{day.dayNumber}</span>
                <span className='userSpan holiday-column'>{day.holiday ? '✔' : ''}</span>
                <span className='userSpan jobdescription'>{day.jobDescription}</span>
                <span className='userSpan startA'>{day.startWorkA}</span>
                <span className='userSpan endA'>{day.endWorkA}</span>
                <span className='userSpan startB'>{day.startWorkB}</span>
                <span className='userSpan endB'>{day.endWorkB}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.total}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.normal}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.lateHours}</span>
                <span className='userSpan hours-min-width'>{day.totalHours && day.totalHours.holidayHours}</span>
              </div>
            </li>
          )
        }
      </ul>
      <h3>Normal rate: <span className='totalHoursStyle'>{localHours.monthHours.normalRate}</span>, Late hours rate: <span className='totalHoursStyle'>{localHours.monthHours.lateHoursRate}</span>, Holyday hours rate: <span className='totalHoursStyle'>{localHours.monthHours.holidayHoursRate},</span> Month total Hours: <span className='totalHoursStyle'>{localHours.monthHours.totalHours}</span></h3>
    </div>
  )
}
const ScreenFour = ({ periodResume }) => {
  // const data = [
  //   { name: 'John Doe', age: 30, job: 'Developer' },
  //   { name: 'Jane Smith', age: 25, job: 'Designer' },
  //   { name: 'Billy Joe', age: 35, job: 'Manager' },
  // ]

  // Function to handle export
  const handleExport = () => {
    if (!periodResume) return;

    // Step 1: Prepare data for Excel export
    const exportData = periodResume.map((employee) => ({
      Name: employee.username,
      "Normal Hours": Number(employee.matchedHours[0].normalRate),
      "Late Hours": Number(employee.matchedHours[0].lateHoursRate),
      "Holiday Hours": Number(employee.matchedHours[0].holidayHoursRate),
      "Total Hours": Number(employee.matchedHours[0].totalHours),
    }));

    // Step 2: Calculate the totals
    const totalNormalHours = periodResume
      .reduce((acc, employee) => acc + Number(employee.matchedHours[0].normalRate), 0);
    const totalLateHours = periodResume
      .reduce((acc, employee) => acc + Number(employee.matchedHours[0].lateHoursRate), 0);
    const totalHolidayHours = periodResume
      .reduce((acc, employee) => acc + Number(employee.matchedHours[0].holidayHoursRate), 0);
    const totalTotalHours = periodResume
      .reduce((acc, employee) => acc + Number(employee.matchedHours[0].totalHours), 0);

    // Step 3: Add the totals row to export data
    exportData.push({
      Name: 'Total',
      "Normal Hours": totalNormalHours,
      "Late Hours": totalLateHours,
      "Holiday Hours": totalHolidayHours,
      "Total Hours": totalTotalHours,
    });

    // Step 4: Create a new workbook
    const wb = XLSX.utils.book_new();

    // Step 5: Convert the data to a worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Step 6: Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Period Resume');

    // Step 7: Export the Excel file
    XLSX.writeFile(wb, 'PeriodResume.xlsx');
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
      <h1>Resume of the Period { period } { year }</h1>
      <Link to="/Jan/"><Button variant='contained' sx={{ marginBottom: '10px' }}>Back</Button></Link>
      <TableContainer component={Paper} sx={{ width: 'auto', marginBottom: '1em' }}>
        <Table sx={{ minWidth: 650 }} aria-label="period table">
          <TableHead>
            <TableRow>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Normal Hours</b></TableCell>
              <TableCell><b>Late Hours</b></TableCell>
              <TableCell><b>Holiday Hours</b></TableCell>
              <TableCell><b>Total Hours</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {periodResume === null ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Loading</TableCell>
              </TableRow>
            ) : (
              <>
                {periodResume
                  .filter(worker => worker.username !== user.username)
                  .map((employee) => (
                    <TableRow key={employee.username} hover>
                      <TableCell>
                        {employee.username
                          .split(' ') // Split the username into an array of words by spaces
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
                          .join(' ') // Join the words back into a single string with spaces
                        }
                      </TableCell>
                      <TableCell>{Number(employee.matchedHours[0].normalRate)}</TableCell>
                      <TableCell>{Number(employee.matchedHours[0].lateHoursRate)}</TableCell>
                      <TableCell>{Number(employee.matchedHours[0].holidayHoursRate)}</TableCell>
                      <TableCell>{Number(employee.matchedHours[0].totalHours)}</TableCell>
                    </TableRow>
                  ))}

                {/* Sum Calculation */}
                <TableRow>
                  <TableCell><b>Total</b></TableCell>
                  <TableCell>
                    {periodResume
                      .filter(worker => worker.username !== user.username)
                      .reduce((acc, employee) => acc + Number(employee.matchedHours[0].normalRate), 0)}
                  </TableCell>
                  <TableCell>
                    {periodResume
                      .filter(worker => worker.username !== user.username)
                      .reduce((acc, employee) => acc + Number(employee.matchedHours[0].lateHoursRate), 0)}
                  </TableCell>
                  <TableCell>
                    {periodResume
                      .filter(worker => worker.username !== user.username)
                      .reduce((acc, employee) => acc + Number(employee.matchedHours[0].holidayHoursRate), 0)}
                  </TableCell>
                  <TableCell>
                    {periodResume
                      .filter(worker => worker.username !== user.username)
                      .reduce((acc, employee) => acc + Number(employee.matchedHours[0].totalHours), 0)}
                  </TableCell>
                </TableRow>
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>


      <Button variant='contained' onClick={handleExport}>
        Export to Excel
      </Button>
    </Box>
  )
}

const onDeactivate = async  (employee) => {
  // console.log('implementar delete ', employee)
  const id = employee.id
  await userService.deactivateUser(id)
  onUpdateEmployees()
}

const onActivate = async  (employee) => {
  // console.log('implementar delete ', employee)
  const id = employee.id
  await userService.activateUser(id)
  onUpdateEmployees()
}

const handleGetEmployee = (employee) => {
  // console.log(employee)
  setWorker(employee)
  localStorage.setItem('janUserEmployee', JSON.stringify(employee))
  navigate(`/Jan/employee/${employee.username}`)
}
const handleGetHours = (hours) => {
  setHours(hours)
  localStorage.setItem('janUserHours', JSON.stringify(hours))
  navigate(`/Jan/employee/${localWorker.username}/hours`)
}
const handleSetPeriod = () => {
  filterByPeriod()
  navigate('/Jan/employees/hours/period')
}
  
  return (
    <Routes>
      <Route path="/*" element={<ScreenOne user={user} employees={employees} />} />
      <Route path="employee/:employeeName" element={<ScreenTwo worker={worker} />} />
      <Route path="employee/:employeeName/hours" element={<ScreenThree hours={hours} worker={worker} />} />
      <Route path="employees/hours/period" element={<ScreenFour periodResume={periodResume} />} />
    </Routes>
    )
}

export default User