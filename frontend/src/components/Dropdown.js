import React from 'react'

function Dropdown({ month, handleChange  }) {

    const options = [
        {label: '-- Select an option --', value: '-- Select an option --'},
        {label: 'January/February', value: 'January/February'},
        {label: 'February/March', value: 'February/March'},
        {label: 'March/April', value: 'March/April'},
        {label: 'April/May', value: 'April/May'},
        {label: 'May/June', value: 'May/June'},
        {label: 'June/July', value: 'June/July'},
        {label: 'July/August', value: 'July/August'},
        {label: 'August/September', value: 'August/September'},
        {label: 'September/October', value: 'September/October'},
        {label: 'October/November', value: 'October/November'},
        {label: 'November/December', value: 'November/December'},
        {label: 'December/January', value: 'December/January'},
    ]

    
    return (
      <div>
          <label>
              Period
              <select name="month" defaultValue={month} placeholder='Select' onChange={handleChange}>
                {options.map((option, index) => (
                    <option key={index} value={option.value} style={{display: option.value === '-- Select an option --' && 'none'}}>{option.label}</option>
                ))}
              </select>
          </label>
      </div>
    )
}

export default Dropdown