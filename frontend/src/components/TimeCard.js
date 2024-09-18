// import React, { useEffect } from 'react'
import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
// material
import { Button, Box, TableContainer, Table, TableHead, TableCell, TableRow, TableBody, Paper , Tooltip, useMediaQuery  } from '@mui/material'
// services
import hoursService from '../services/hours'
// import usersService from '../services/users'
// components
import Dropdown from '../components/Dropdown'
import UserSettings from './UserSettings'


// component containing inner components for each screen: employee list of time cards, specific time card,
// create time card & update time card 
const TimeCard = ({ user, setUser, setErrorMessage }) => {
    // const [screen, setScreen] = useState('1')
    const [hours, setHours] = useState(null)

    const navigate = useNavigate()

    const loading = () => {
        if (user === null) {
            localStorage.setItem('employeeUser', JSON.stringify(user))
        }
    }

    const localUser = user ? user : JSON.parse(localStorage.getItem('employeeUser'))

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

    const ScreenOne = () => {
        loading()
        const isMobileScreen = useMediaQuery('(min-width: 1250px)')
        const listScreenOneStyles = {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative', // Allows absolute positioning of child elements
        }
        const settingsStyles = isMobileScreen ? {
          position: 'absolute',
          top: '10px',
          right: '10px',
        } : {}
        return (
            <div style={listScreenOneStyles}>
                <div style={settingsStyles}>
                    <UserSettings isEmployee={true}/>
                </div>
                <Link to="/Home/createTimeCard"><Button variant="contained" sx={{ marginBottom: '10px' }}>New time card</Button></Link>
                <TableContainer component={Paper} sx={{ width: 'auto', marginBottom: '1em' }}>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>Period</TableCell>
                        <TableCell>Last Update</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {localUser && localUser.hours.map(hours => (
                        <TableRow key={hours.id} hover>
                          <TableCell component="th" scope="row">
                            {hours.month}
                          </TableCell>
                          <TableCell>
                            <Tooltip title={"YYYY-MM-DD"}>
                                <span>
                                    {handleDate(hours.date)}
                                </span>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Link to="/Home/hours" style={{ textDecoration: 'none' }}>
                              <Button
                                variant="outlined"
                                onClick={() => handleGetHours(hours)}
                              >
                                View Details
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            </div>            
        )
    }
        
    const ScreenTwo = ({ hours }) => {
        const localHours = hours ? hours : JSON.parse(localStorage.getItem('employeeUserHours'))

        return (
          <div>
            <h1>{localHours.month.toUpperCase()}</h1>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1em' }}>
                <Link to="/Home"><Button variant="contained" className='screenBtn'>Back</Button></Link>
                <Link to="/Home/editTimeCard"><Button variant="contained" className='screenBtn'>Edit</Button></Link>
            </Box>

            <div className='userTable userTableHeader'>
                <span className='headerTitle date-column'>DATE</span>
                <span className='headerTitle holiday-column'>HOLYDAY</span>
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
      
    const ScreenThree = () => {
        
        // set timecard template
        const hours = {
            month: '',
            days:[],
            monthHours:'',    
        }
        const days = []
        
        // set days
        for (let index = 0; index < 31; index++) {
            if (index < 11) {
                    days.push({
                    dayNumber: index + 21,  // day start from 21 'couse index is 0. once index is 10 day is 31
                    jobDescription: '',
                    startWorkA: '00:00',
                    endWorkA: '00:00',
                    totalHours: '',
                })    
            } else {
                    days.push({
                    dayNumber: index - 10,  // once index is 11 substract 10 to start from this point with day 1
                    jobDescription: '',
                    startWorkA: '00:00',
                    endWorkA: '00:00',
                    totalHours: '',
                })
            }
        }

        hours.days = days
        
        const [inputs, setInputs] = useState({})        
        const [checked, setChecked] = useState({})

        useEffect(() => {
            
            if (inputs.month) {
                hours.days.map((singleDay, index) => {
                    return setInputs(values => ({...values,[`day${index}`]: ''}))
                })
                

                
                // const date = ["Thu", "Dec", "19", "2022"]
                console.log("new Date().toString().split(' ')",new Date().toString().split(' '))
                console.log("new Date(copenhagenTime()).toString().split(' ')",new Date(copenhagenTime()).toString().split(' '))

                const date = new Date(copenhagenTime()).toString().split(' ')
                // console.log(date)
                // console.log('date[1]', date[1], 'is january', date[1] === 'Jan')
                
                let monthA = ''
                let monthB = ''

                switch (inputs.month) {
                    case 'January/February':
                        monthA = '01'
                        monthB = '02'
                        break;
                    
                    case 'February/March':
                        monthA = '02'
                        monthB = '03'
                        break;

                    case 'March/April':
                        monthA = '03'
                        monthB = '04'
                        break;
                    
                    case 'April/May':
                        monthA = '04'
                        monthB = '05'
                        break;

                    case 'May/June':
                        monthA = '05'
                        monthB = '06'
                        break;
                    
                    case 'June/July':
                        monthA = '06'
                        monthB = '07'
                        break;

                    case 'July/August':
                        monthA = '07'
                        monthB = '08'
                        break;
                    
                    case 'August/September':
                        monthA = '08'
                        monthB = '09'
                        break;

                    case 'September/October':
                        monthA = '09'
                        monthB = '10'
                        break;
                    
                    case 'October/November':
                        monthA = '10'
                        monthB = '11'
                        break;

                    case 'November/December':
                        monthA = '11'
                        monthB = '12'
                        break;
                    
                    case 'December/January':
                        monthA = '12'
                        monthB = '01'
                        break;
                
                    default:
                        break;
                }

                let year = date[3]
                // date.[3] (year)
                // 2022-07-15

                let yearB = new Date(copenhagenTime(year)).toString().split(' ')[3]
                ++ yearB
                
                
                // february has 29 days                
                const leapYears = ['2024', '2028', '2032', '2036', '2040']

                const isLeapYear = (leapYears.indexOf(date[3]) !== -1)

                // 31 days
                const longMonth = [
                    'January/February',
                    'March/April',
                    'May/June',
                    'July/August',
                    'August/September',
                    'October/November',
                    'December/January',
                ]

                const isLongMonth = (longMonth.indexOf(inputs.month) !== -1)

                const isFebruary = inputs.month === 'February/March'

                const newYear = inputs.month === 'December/January'

                // if timecard is created in january for the period of dec/jan
                if (newYear & date[1] === 'Jan') {
                    --year
                    --yearB
                }
                
                
                for (let index = 0; index < 31; index++) {
                    if (index === 8 && isFebruary === true && isLeapYear === false) continue
                    if (index === 9 && isFebruary === true) continue
                    if (index === 10 && isLongMonth === false) continue

                    if (index < 11) {
                        setInputs(values => ({...values,
                            [`day${index}`]: `${year}-${monthA}-${index + 21}`,
                        }))
                    }

                    // if (newYear & date[1] === 'Dec') {
                    if (newYear) {

                        if (index > 10 && index < 20) {
                        setInputs(values => ({...values,
                            [`day${index}`]: `${yearB}-${monthB}-0${index - 10}`,
                        }))
                        }
                        if (index > 19) {
                            setInputs(values => ({...values,
                                [`day${index}`]: `${yearB}-${monthB}-${index - 10}`,
                            }))
                        }
                        continue

                    }

                    if (index > 10 && index < 20) {
                        setInputs(values => ({...values,
                            [`day${index}`]: `${year}-${monthB}-0${index - 10}`,
                        }))
                    }

                    if (index > 19) {
                        setInputs(values => ({...values,
                            [`day${index}`]: `${year}-${monthB}-${index - 10}`,
                        }))
                    }
                }
                
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [inputs.month])

        
        const timeToDecimal = (t) => {
            var arr = t.split(':')
            var dec = parseInt((arr[1]/6)*10, 10)
        
            return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
        }

        
        const calculate = (startTimeA, endTimeA, startTimeB, endTimeB, isWeekend, holiday) => {
            let startA = startTimeA
            let endA = endTimeA
            let startB = startTimeB
            let endB = endTimeB

            let normal = 0
            let lateHours = 0
            let holidayHours = 0

            if (endA < 4) {
                endA += 24
            }

            if (endB < 4) {
                endB += 24
            }

            
            if(startTimeA === endTimeA) {
                startA = 0
                endA = 0
            }

            if(startTimeB === endTimeB) {
                startB = 0
                endB = 0
            }
            
            let total = endA - startA + endB - startB

            // monday to friday
            // ----------------

            // isWeekend !== 6 (saturday) || isWeekend !== 0 (sunday)
            
            if (isWeekend !== 6) {     
                
                if (startA >= 18) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 18) {
                    lateHours = endA - 18 + endB - startB
                    normal = 18 - startA
                } else if (startB >= 18) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 18) {
                    lateHours = endB - 18
                    normal = 18 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // ----------------
            // monday to friday



            // saturday
            // --------

            // isWeekend === 6 (saturday)

            if (isWeekend === 6) {

                if (startA >= 14) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 14) {
                    lateHours = endA - 14 + endB - startB
                    normal = 14 - startA
                } else if (startB >= 14) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 14) {
                    lateHours = endB - 14
                    normal = 14 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // --------
            // saturday
            
            

            normal = normal % 1 !== 0 ? normal.toFixed(2) : normal
            lateHours = lateHours % 1 !== 0 ? lateHours.toFixed(2) : lateHours
            total = total % 1 !== 0 ? total.toFixed(2) : total

            // isWeekend === 0 (sunday) or holiday (checkbox)
            if (isWeekend === 0 || holiday) {
                holidayHours = total
                lateHours = 0
                normal = 0
            }

            return {                
                normal: normal,
                lateHours: lateHours,
                holidayHours: holidayHours,
                total: total
            }
        }

        const handleChange = (event) => {

            const name = event.target.name
            const value = event.target.value

            setInputs(values => ({...values,
                [name]: value,
            }))

            setChecked(values => ({...values,
                [name]: event.target.checked,}))
            
        }

        const addTimeCard = async (event) => {
            event.preventDefault()

            const {month} = inputs
            if (!month) {                
                setErrorMessage('Month is a required field')
                setTimeout(() => {
                setErrorMessage(null)
                }, 5000)
                return
            }

            const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            
            hours.days.forEach((singleDay, index) => {

                // if startWorkA is not defined, leave default value time 00:00
                singleDay.startWorkA = inputs[`startWorkA${index}`] || '00:00'
                
                singleDay.startWorkB = inputs[`startWorkB${index}`] || '00:00'
                
                singleDay.endWorkA = inputs[`endWorkA${index}`] || '00:00'

                singleDay.endWorkB = inputs[`endWorkB${index}`] || '00:00'

                singleDay.jobDescription = inputs[`jobDescription${index}`] || ''

                singleDay.holiday = checked[`holiday${index}`] || false

                singleDay.dayNumber = inputs[`day${index}`] ? `${inputs[`day${index}`]} ${dayName[new Date(copenhagenTime(inputs[`day${index}`])).getDay()]}` : ''

                singleDay.totalHours = calculate(timeToDecimal(singleDay.startWorkA), timeToDecimal(singleDay.endWorkA), timeToDecimal(singleDay.startWorkB), timeToDecimal(singleDay.endWorkB), new Date(copenhagenTime(inputs[`day${index}`])).getDay(), checked[`holiday${index}`])

            })
                        

            const normal = hours.days.map(day => day.totalHours && day.totalHours.normal)
            const lateHours = hours.days.map(day => day.totalHours && day.totalHours.lateHours)
            const holidayHours = hours.days.map(day => day.totalHours && day.totalHours.holidayHours)
            const total = hours.days.map(day => day.totalHours && day.totalHours.total)
            const allNormal = normal.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allLateHours = lateHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allHolidayHours = holidayHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allTotal = total.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)

            let numallNormal = allNormal % 1 !== 0 ? parseFloat(allNormal).toFixed(2) : allNormal
            let numallLateHours = allLateHours % 1 !== 0 ? parseFloat(allLateHours).toFixed(2) : allLateHours
            let numallHolidayHours = allHolidayHours % 1 !== 0 ? parseFloat(allHolidayHours).toFixed(2) : allHolidayHours
            let numallTotal = allTotal % 1 !== 0 ? parseFloat(allTotal).toFixed(2) : allTotal

            hours.monthHours = {
                totalHours: numallTotal,
                normalRate: numallNormal,
                lateHoursRate: numallLateHours,
                holidayHoursRate: numallHolidayHours,
            }

            hours.month = inputs.month
            
            const newHours = await hoursService.create(hours)
            setErrorMessage('Time card created')
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            localUser.hours.unshift(newHours)
            navigate('/Home')
        }

        return (
            <div sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h1>TIME CARD</h1>
                <Link to="/Home"><Button variant='contained' sx={{ marginBottom: '1em' }} className='screenBtn'>Back</Button></Link>                
                <form onSubmit={addTimeCard}>

                    <Dropdown
                        handleChange={handleChange}                        
                    />

                    <div className='timecard'>

                            {days.map((eachDay, index) => {
                                    
                                    return(
                                
                                            <div className={index === 0 ? 'eachDay topeachday' : 'eachDay'} key={index}>                                                

                                                {
                                                    inputs[`day${index}`] &&
                                                    <div>
                                                        {index === 0 && <p className='mobileHide'>Date</p>}

                                                        <p className='inputsDay'>{inputs[`day${index}`] || ''}</p>
                                                    </div>
                                                }

                                                {
                                                    inputs[`day${index}`] &&
                                                    <div>
                                                        {index === 0 && <p className='mobileHide'>Holyday</p>}

                                                        <input className='holiday'
                                                            id={index}
                                                            type="checkbox"
                                                            name={`holiday${index}`}
                                                            value={inputs[`holiday${index}`] || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    inputs[`day${index}`] &&
                                                    <div>
                                                        {index === 0 && <p className='mobileHide'>Job Description</p>}

                                                        <input 
                                                            id={index}
                                                            type="text"
                                                            name={`jobDescription${index}`}
                                                            value={inputs[`jobDescription${index}`] || ''}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    inputs[`day${index}`] &&
                                                    <div>
                                                        {index === 0 && <p className='startA mobileHide'>Start</p>}

                                                        <input className='startA'
                                                            id={index}
                                                            type="time"
                                                            name={`startWorkA${index}`}
                                                            value={inputs[`startWorkA${index}`] || '00:00'}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    inputs[`day${index}`] &&
                                                    <div>
                                                        {index === 0 && <p className='endA mobileHide'>End</p>}

                                                        <input className='endA'
                                                            id={index}
                                                            type="time"
                                                            name={`endWorkA${index}`}
                                                            value={inputs[`endWorkA${index}`] || '00:00'}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    inputs[`day${index}`] &&
                                                    <div>
                                                        {index === 0 && <p className='startB mobileHide'>Start</p>}

                                                        <input  className='startB'
                                                            id={index}
                                                            type="time"
                                                            name={`startWorkB${index}`}
                                                            value={inputs[`startWorkB${index}`] || '00:00'}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                }

                                                {
                                                    inputs[`day${index}`] &&
                                                    <div>
                                                        {index === 0 && <p className='endB mobileHide'>End</p>}

                                                        <input  className='endB'
                                                            id={index}
                                                            type="time"
                                                            name={`endWorkB${index}`}
                                                            value={inputs[`endWorkB${index}`] || '00:00'}
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                }

                                                
                                            </div>   )} 
                            )}
                    </div>
                    { inputs.month && <Button variant='contained' sx={{ marginBottom: '1em' }} className='uploadBtn screenBtn' type="submit">Upload</Button> }
                </form>
            </div>
        )
    }

    // edit and update time card
    const ScreenFour = ({ hours }) => {
        const localHours = hours ? hours : JSON.parse(localStorage.getItem('employeeUserHours'))

        const hoursToUpdate = localHours

        const inputsInitialValues = hoursToUpdate.days
            .reduce((name, value, index)=> {
                name[`day${index}`] = value.dayNumber.split(" ")[0]
                name[`holiday${index}`] = value.holiday
                name[`jobDescription${index}`] = value.jobDescription || ''
                name[`startWorkA${index}`] = value.startWorkA
                name[`endWorkA${index}`] = value.endWorkA
                name[`startWorkB${index}`] = value.startWorkB
                name[`endWorkB${index}`] = value.endWorkB
                name[`totalHours${index}`] = value.totalHours
                return name
            }, {})

        inputsInitialValues['month'] = hoursToUpdate.month

        const checkedInitialValues = hoursToUpdate.days
            .reduce((name, value, index)=> {                
                name[`holiday${index}`] = value.holiday
                return name
            }, {})
        

        const [inputs, setInputs] = useState({...inputsInitialValues})

        const [checked, setChecked] = useState({...checkedInitialValues})
        
        useEffect(() => {
            
            if (inputs.month) {
                localHours.days.map((singleDay, index) => {
                    return setInputs(values => ({...values,[`day${index}`]: ''}))
                })
                
                const date = new Date(copenhagenTime()).toString().split(' ')
                
                let monthA = ''
                let monthB = ''

                switch (inputs.month) {
                    case 'January/February':
                        monthA = '01'
                        monthB = '02'
                        break;
                    
                    case 'February/March':
                        monthA = '02'
                        monthB = '03'
                        break;

                    case 'March/April':
                        monthA = '03'
                        monthB = '04'
                        break;
                    
                    case 'April/May':
                        monthA = '04'
                        monthB = '05'
                        break;

                    case 'May/June':
                        monthA = '05'
                        monthB = '06'
                        break;
                    
                    case 'June/July':
                        monthA = '06'
                        monthB = '07'
                        break;

                    case 'July/August':
                        monthA = '07'
                        monthB = '08'
                        break;
                    
                    case 'August/September':
                        monthA = '08'
                        monthB = '09'
                        break;

                    case 'September/October':
                        monthA = '09'
                        monthB = '10'
                        break;
                    
                    case 'October/November':
                        monthA = '10'
                        monthB = '11'
                        break;

                    case 'November/December':
                        monthA = '11'
                        monthB = '12'
                        break;
                    
                    case 'December/January':
                        monthA = '12'
                        monthB = '01'
                        break;
                
                    default:
                        break;
                }

                const year = date[3]
                // date.[3] (year)
                // 2022-07-15

                let yearB = new Date(copenhagenTime(year)).toString().split(' ')[3]
                ++ yearB
                
                // february has 29 days                
                const leapYears = ['2024', '2028', '2032', '2036', '2040']

                const isLeapYear = (leapYears.indexOf(date[3]) !== -1)

                // 31 days
                const longMonth = [
                    'January/February',
                    'March/April',
                    'May/June',
                    'July/August',
                    'August/September',
                    'October/November',
                    'December/January',
                ]

                const isLongMonth = (longMonth.indexOf(inputs.month) !== -1)

                const isFebruary = inputs.month === 'February/March'

                const newYear = inputs.month === 'December/January'
                
                
                for (let index = 0; index < 31; index++) {
                    if (index === 8 && isFebruary === true && isLeapYear === false) continue
                    if (index === 9 && isFebruary === true) continue
                    if (index === 10 && isLongMonth === false) continue

                    if (index < 11) {
                        setInputs(values => ({...values,
                            [`day${index}`]: `${year}-${monthA}-${index + 21}`,
                        }))
                    }

                    if (newYear) {

                        if (index > 10 && index < 20) {
                        setInputs(values => ({...values,
                            [`day${index}`]: `${yearB}-${monthB}-0${index - 10}`,
                        }))
                        }
                        if (index > 19) {
                            setInputs(values => ({...values,
                                [`day${index}`]: `${yearB}-${monthB}-${index - 10}`,
                            }))
                        }
                        continue

                    }

                    if (index > 10 && index < 20) {
                        setInputs(values => ({...values,
                            [`day${index}`]: `${year}-${monthB}-0${index - 10}`,
                        }))
                    }

                    if (index > 19) {
                        setInputs(values => ({...values,
                            [`day${index}`]: `${year}-${monthB}-${index - 10}`,
                        }))
                    }
                }
                
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [inputs.month])

        const timeToDecimal = (t) => {
            var arr = t.split(':')
            var dec = parseInt((arr[1]/6)*10, 10)
        
            return parseFloat(parseInt(arr[0], 10) + '.' + (dec<10?'0':'') + dec)
        }

        const calculate = (startTimeA, endTimeA, startTimeB, endTimeB, isWeekend, holiday) => {
            let startA = startTimeA
            let endA = endTimeA
            let startB = startTimeB
            let endB = endTimeB

            let normal = 0
            let lateHours = 0
            let holidayHours = 0

            if (endA < 4) {
                endA += 24
            }

            if (endB < 4) {
                endB += 24
            }

            
            if(startTimeA === endTimeA) {
                startA = 0
                endA = 0
            }

            if(startTimeB === endTimeB) {
                startB = 0
                endB = 0
            }
            
            let total = endA - startA + endB - startB

            // monday to friday
            // ----------------

            // isWeekend !== 6 (saturday) || isWeekend !== 0 (sunday)
            
            if (isWeekend !== 6) {     
                
                if (startA >= 18) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 18) {
                    lateHours = endA - 18 + endB - startB
                    normal = 18 - startA
                } else if (startB >= 18) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 18) {
                    lateHours = endB - 18
                    normal = 18 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // ----------------
            // monday to friday



            // saturday
            // --------

            // isWeekend === 6 (saturday)

            if (isWeekend === 6) {

                if (startA >= 14) {
                    lateHours = endA - startA + endB - startB
                    normal = 0
                } else if (endA >= 14) {
                    lateHours = endA - 14 + endB - startB
                    normal = 14 - startA
                } else if (startB >= 14) {
                    lateHours = endB - startB
                    normal = endA - startA
                } else if (endB >= 14) {
                    lateHours = endB - 14
                    normal = 14 - startB + endA - startA
                } else {
                    lateHours = 0
                    normal = endA - startA + endB - startB
                }

            }
            // --------
            // saturday
            
            

            normal = normal % 1 !== 0 ? normal.toFixed(2) : normal
            lateHours = lateHours % 1 !== 0 ? lateHours.toFixed(2) : lateHours
            total = total % 1 !== 0 ? total.toFixed(2) : total

            // isWeekend === 0 (sunday) or holiday (checkbox)
            if (isWeekend === 0 || holiday) {
                holidayHours = total
                lateHours = 0
                normal = 0
            }

            return {                
                normal: normal,
                lateHours: lateHours,
                holidayHours: holidayHours,
                total: total
            }
        }

        const handleChange = (event) => {

            const name = event.target.name
            const value = event.target.value
            setInputs(values => ({...values,
                [name]: value,
            }))

            setChecked(values => ({...values,
                [name]: event.target.checked,}))
        }

        // update
        const addTimeCard = async (event) => {
            event.preventDefault()
            const {month} = inputs
            if (!month) {
                setErrorMessage('Month is a required field')
                setTimeout(() => {
                setErrorMessage(null)
                }, 5000)
                return
            }

            const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

            hoursToUpdate.days.forEach((singleDay, index) => {
                // if startWorkA is not defined, leave default value time 00:00
                singleDay.startWorkA = inputs[`startWorkA${index}`] || '00:00'
                
                singleDay.startWorkB = inputs[`startWorkB${index}`] || '00:00'
                
                singleDay.endWorkA = inputs[`endWorkA${index}`] || '00:00'

                singleDay.endWorkB = inputs[`endWorkB${index}`] || '00:00'

                singleDay.jobDescription = inputs[`jobDescription${index}`] || ''

                singleDay.holiday = checked[`holiday${index}`] || false

                singleDay.dayNumber = inputs[`day${index}`] ? `${inputs[`day${index}`]} ${dayName[new Date(copenhagenTime(inputs[`day${index}`])).getDay()]}` : ''

                singleDay.totalHours = calculate(timeToDecimal(singleDay.startWorkA), timeToDecimal(singleDay.endWorkA), timeToDecimal(singleDay.startWorkB), timeToDecimal(singleDay.endWorkB), new Date(copenhagenTime(inputs[`day${index}`])).getDay(), checked[`holiday${index}`])
            })
          

            const normal = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.normal)
            const lateHours = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.lateHours)
            const holidayHours = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.holidayHours)
            const total = hoursToUpdate.days.map(day => day.totalHours && day.totalHours.total)
            const allNormal = normal.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allLateHours = lateHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allHolidayHours = holidayHours.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)
            const allTotal = total.filter(value => value !== undefined ).map(x => x = Number(x)).reduce((a,b) => a+b)

            let numallNormal = allNormal % 1 !== 0 ? parseFloat(allNormal).toFixed(2) : allNormal
            let numallLateHours = allLateHours % 1 !== 0 ? parseFloat(allLateHours).toFixed(2) : allLateHours
            let numallHolidayHours = allHolidayHours % 1 !== 0 ? parseFloat(allHolidayHours).toFixed(2) : allHolidayHours
            let numallTotal = allTotal % 1 !== 0 ? parseFloat(allTotal).toFixed(2) : allTotal

            hoursToUpdate.monthHours = {
                totalHours: numallTotal,
                normalRate: numallNormal,
                lateHoursRate: numallLateHours,
                holidayHoursRate: numallHolidayHours,
            }
            

            hoursToUpdate.month = inputs.month
            
            
            await hoursService
              .update(localHours.id, hoursToUpdate)
              setErrorMessage('Time card updated')
              setTimeout(() => {
                setErrorMessage(null)
              }, 5000)
        }

        return (
            <div>
                <h1>TIME CARD</h1>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: '1em', marginBottom: '1em' }}>
                    <Link to="/Home/hours"><Button variant="contained" className='screenBtn'>Back</Button></Link>
                    <Link to="/Home"><Button variant="contained" className='screenBtn'>Home</Button></Link>
                </Box>
                
                <form onSubmit={addTimeCard}>

                    <Dropdown
                        handleChange={handleChange}
                        month={inputs.month}
                    />

                    <div className='timecard'>

                        {localHours.days.map((eachDay, index) => {

                            return(

                                <div className={index === 0 ? 'eachDay topeachday' : 'eachDay'} key={index}>

                                    {inputs[`day${index}`] &&

                                    <div>

                                        {index === 0 && <p className='mobileHide'>Date</p>}

                                        <p className='inputsDay'>{inputs[`day${index}`] || ''}</p>

                                    </div>

                                    }

                                    {inputs[`day${index}`] &&

                                    <div>

                                        {index === 0 && <p className='mobileHide'>Holyday</p>}

                                        <input className='holiday'
                                            id={index}
                                            type="checkbox"
                                            name={`holiday${index}`}
                                            checked={checked[`holiday${index}`] || ''}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    }

                                    {inputs[`day${index}`] &&

                                    <div>

                                        {index === 0 && <p className='mobileHide'>Job Description</p>}

                                        <input 
                                            id={index}
                                            type="text"
                                            name={`jobDescription${index}`}
                                            value={inputs[`jobDescription${index}`] || ''}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    }

                                    {inputs[`day${index}`] &&

                                    <div>

                                        {index === 0 && <p className='startA mobileHide'>Start</p>}

                                        <input className='startA'
                                            id={index}
                                            type="time"
                                            name={`startWorkA${index}`}
                                            value={inputs[`startWorkA${index}`] || '00:00'}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    }

                                    {inputs[`day${index}`] &&

                                    <div>

                                        {index === 0 && <p className='endA mobileHide'>End</p>}

                                        <input className='endA'
                                            id={index}
                                            type="time"
                                            name={`endWorkA${index}`}
                                            value={inputs[`endWorkA${index}`] || '00:00'}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    }

                                    {inputs[`day${index}`] &&

                                    <div>

                                        {index === 0 && <p className='startB mobileHide'>Start</p>}

                                        <input  className='startB'
                                            id={index}
                                            type="time"
                                            name={`startWorkB${index}`}
                                            value={inputs[`startWorkB${index}`] || '00:00'}
                                            onChange={handleChange}
                                        />

                                    </div>

                                    }

                                    {inputs[`day${index}`] &&

                                    <div>

                                        {index === 0 && <p className='endB mobileHide'>End</p>}

                                        <input  className='endB'
                                            id={index}
                                            type="time"
                                            name={`endWorkB${index}`}
                                            value={inputs[`endWorkB${index}`] || '00:00'}
                                            onChange={handleChange}
                                    />

                                    </div>

                                    }

                                </div>

                            )
                            
                        })}
                    </div>

                    <Button variant="contained" sx={{ marginBottom: '1em' }} className='uploadBtn screenBtn' type="submit">Upload</Button>

                </form>
            </div>
        )

    }

    const handleGetHours = (hours) => {
        setHours(hours)
        localStorage.setItem('employeeUserHours', JSON.stringify(hours))
    }
    
    return (
        <Routes>
          <Route path="/*" element={<ScreenOne user={user}/>} />
          <Route path="hours" element={<ScreenTwo hours={ hours }/>} />
          <Route path="createTimeCard" element={<ScreenThree/>}/>
          <Route path="editTimeCard" element={<ScreenFour hours={ hours }/>} />
        </Routes>    
    )
}

export default TimeCard