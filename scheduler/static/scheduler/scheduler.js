
document.addEventListener('DOMContentLoaded', function() {

    // GLOBAL
    const overlay = document.querySelector('#overlay') // Overlay for backround when pop-up windows appear
    const section = document.querySelector('.section_display')


    // States
    //localStorage.clear()
    const state_selectedMenu = localStorage.getItem('tab_id')
    const state_selectedActivity = localStorage.getItem('activityrow')
    //const state_bottomMenu = localStorage.getItem('bottomMenu')
    const state_activeProject = localStorage.getItem('project_id')
    const state_hiddenSideMenu = localStorage.getItem('hiddenSideMenu')
    
    // BOTTOM MENU ------------------------------------------------------------------------------------------------------
    const bottomSection = document.querySelector('#bottom-section')
    const hideButton = document.querySelector('#button-hide')
    const sectionBody = document.querySelector('.body')
    const navBar = document.querySelector('.navbar')
    const logoutButton = document.querySelector('.logout-button')
    const bottomTabs = document.querySelectorAll('.tab')
    const bottomMenus = document.querySelectorAll('.bottom-menus')
    
    
   
    if (section) { // all sections except "Login" and "Registration"
        console.log(localStorage.getItem('project_id'))
        hide(navBar) // Hide Blue Navbar

        // Create Top Menu Tabs 
        const topMenuTabs = document.querySelector('#top-menu-tabs')
        // Projects
        const projectsLink = document.createElement('button')
            projectsLink.className = "button-top-menu"
            projectsLink.id = 'projects-link'
            projectsLink.innerHTML = 'Projects'
        // Activities
        const activitiesLink = document.createElement('button')
            activitiesLink.className = "button-top-menu"
            activitiesLink.id = 'activities-link'
            activitiesLink.innerHTML = 'Activities'

        topMenuTabs.append(projectsLink)
        // Create activities tab if there is an opened project
        if (state_activeProject) {topMenuTabs.append(activitiesLink)}

        // Opening Pages
        activitiesLink.addEventListener('click', () => { // Activities Page
            localStorage.setItem('tab_id', 'tabGenerals') // Set State
            window.location.href = `/activities/${state_activeProject}`
        })
        projectsLink.addEventListener('click', () => { // Projects Page
            localStorage.setItem('tab_id', 'tabGeneral') // Set State
            window.location.href = '/'
        })

        
        // Logout
        logoutButton.onclick = () => {
            window.location.href = '/logout' 
            localStorage.clear()
        }

        // Bottom Section
        const bottomSectionHeight = 240
        bottomSection.style.height = `${bottomSectionHeight}px`
        sectionBody.style.height = `${window.innerHeight - bottomSectionHeight - 55}px`
    
        // Hide, Show Bottom Menu
        let hiddenstate = false
        hideButton.addEventListener('click', () => {
            // Change icon up, down
            var down = "fa-solid fa-angle-down fa-lg"
            var up = "fa-solid fa-angle-up fa-lg"
            hideButton.className = (hideButton.className == up)? down : up
            
            // Hide, show windoow
            bottomSection.style.height = hiddenstate? `${bottomSectionHeight}px` : '20px'
            
            // Change section body size 
            var sectionBodyHeight = parseInt(getComputedStyle(sectionBody).height.replace('px', ''))
            
            if (hiddenstate) {sectionBody.style.height = `${window.innerHeight - bottomSectionHeight - 55}px`}
            else {sectionBody.style.height = `${window.innerHeight - 75}px`}
            
            // Toggle hidden state of bottom window
            hiddenstate = !hiddenstate  

        })

        //Resize Body Section on window resize
        window.addEventListener('resize', () => {
            if (hiddenstate) {sectionBody.style.height = `${window.innerHeight}px`}
            else{sectionBody.style.height = `${window.innerHeight - bottomSectionHeight  - 55 }px`}
            
        });
        
        // Select Bottom Tabs
        // Show selected menu on page loads 
        bottomMenus.forEach(menu => hide(menu))
        if (state_selectedMenu) {show(document.querySelector(`#${state_selectedMenu}`))}
        // Select tab
        bottomTabs.forEach (tab => {tab.onclick = () => {
            // Reset not selected tabs
            bottomTabs.forEach (tab => {tab.className = 'tab'})
            
            // Show selected, hide others
            bottomMenus.forEach(menu => hide(menu) )
            const selectedMenu = document.querySelector(`#tab${tab.id}`)
            show(selectedMenu)
            
            // Hide view State
            localStorage.setItem('tab_id', `tab${tab.id}`)
            
            // Set color for selected tab
            tab.className = 'selected-tab'
            
        }})
        

        // Select Project
        const selectall = document.getElementById('selectall')
        const checkboxes = document.querySelectorAll('input[type="checkbox"]')
        if (selectall) {
            selectall.addEventListener('click', () => {
                if (selectall.checked) {checkboxes.forEach(box => {box.checked = true})}
                else {checkboxes.forEach (box => {box.checked = false})}
            })
        }

        // Project Page Bottom Tabs
        if (section.id == 'projects') {
            // Project General Tab
            const projectRows = document.querySelectorAll('#project-row')
            const projectIdInput = document.querySelector('#project-id-input')
            const projectNameInput = document.querySelector('#project-name-input')
            const projectDurationType = document.querySelector('#project-durationtype')
            const projectPercentcomplete = document.querySelector('#project-percentcomplete')
            const projectCalendar = document.querySelector('#project-calendar')
            const inputs = [projectIdInput, projectNameInput, projectDurationType, projectPercentcomplete, projectCalendar]
            disableElements(inputs)
            
            // Cehck box selection
            checkboxes.forEach(box => {
                box.addEventListener('click', () => {
                    const checkedboxes = document.querySelectorAll('input[type="checkbox"]:checked')

                    if (checkedboxes.length === 1) {
                        projectIdInput.value = (checkedboxes[0].id === "selectall")? "": checkedboxes[0].id // If only select all check box remains selected
                        projectNameInput.value = checkedboxes[0].name
                        enableElements(inputs)
                    } else {
                        projectIdInput.value = ""
                        projectNameInput.value = ""
                        disableElements(inputs)
                    }
                })
            })
            
            // Edit Project Id
            let projectIdList =[]
            for (let i=0; i < projectRows.length; i++) {projectIdList.push(projectRows[i].className)}

            var projectIdCell, checkedbox;
            projectIdInput.addEventListener('click', () => {
                checkedbox = document.querySelector('input[type="checkbox"]:checked')
                projectIdCell = document.querySelector(`td[name="${projectIdInput.value}"]`)
                console.log(projectIdCell.innerHTML)
            })
            projectIdInput.addEventListener('input', () => {
                projectIdCell.innerHTML = projectIdInput.value
                // Unique Id Check
                if (projectIdList.indexOf(projectIdInput.value)!== -1) {projectIdInput.style.color = 'red'}  
                else {projectIdInput.style.color = 'black'} 
                console.log(projectIdCell.innerHTML)
            })
            projectIdInput.addEventListener('change', () => {
                console.log(checkedbox.id)
                // Unique Id Check
                if (projectIdList.indexOf(projectIdInput.value)!== -1) {
                    warning("Please enter a unique Project Id")
                    // Set Initial Values
                    projectIdInput.value = checkedbox.id
                    projectIdCell.textContent =  checkedbox.id
                    projectIdInput.style.color = 'black'
                }
                // Empty Id Check
                else if (projectIdInput.value === "") {
                    warning("Please enter a value for Project Id")
                    // Set Initial Values
                    projectIdInput.value = checkedbox.id
                    projectIdCell.textContent =  checkedbox.id
                }
                
                // Edit Id if Id is Unique
                else {
                    editProject("project_id", checkedbox.id, projectIdInput.value)
                    projectIdCell.id = projectIdInput.value
                    projectIdCell.setAttribute('name', `${projectIdInput.value}`)
                    checkedbox.id = projectIdInput.value
                    
                    // Store seleceted project state
                    localStorage.setItem('project_id', `${projectIdInput.value}`)
                }
            })

            // Edit Project Name
            var projectNameCell;
            projectNameInput.addEventListener('click', () =>  {
                checkedbox = document.querySelector('input[type="checkbox"]:checked')
                projectNameCell = document.querySelector(`td[name="${checkedbox.id}"][id="${projectNameInput.value}"]`)
            })
            projectNameInput.addEventListener('input', (event) =>  {
                projectNameCell.textContent = event.target.value  
            })
            projectNameInput.addEventListener('change', () =>  {
                if (projectNameInput.value === "") {
                    warning("Please enter a project name")
                    projectNameCell.textContent = checkedbox.getAttribute('name')
                    projectNameInput.value = checkedbox.getAttribute('name')
                }
                else {
                    editProject("name", checkedbox.id, projectNameInput.value)
                    projectNameCell.id = projectNameInput.value
                    checkedbox.setAttribute('name', projectNameInput.value)
                }
            })

        }

    
    } // End of Bottom Menu  ----------------------------------------------------------------------------------------------


    // SIDE MENU  ---------------------------------------------------------------------------------------------------------
    const menuButton = document.querySelector('#menu-button')
    const sideMenu = document.querySelector('#sidemenu-left')
    const addNewProjectButton = document.getElementById('addnew')
    const openButton = document.querySelector('#openproject')
    const deleteButton = document.getElementById('deleteproject')
    const newActivityButton = document.querySelector('#addnew-activity')
    const deleteActivityButton = document.querySelector('#delete-activity')
    const runButton = document.querySelector('#run')

    if (section) {

        // Get side menu hidden state from local storage
        let hiddenSideMenu = false;
        if (state_hiddenSideMenu === 'nothidden') {
            document.querySelector('.body').style.transition = 'none'
            document.querySelector('.bottom-section').style.transition = 'none'
            document.querySelector('.sidemenu-left').style.transition = 'none'
            
            showSideMenu()
            hiddenSideMenu = false
        }
        else {
            hideSideMenu()
            hiddenSideMenu = true
        }

        // Toggle Side Menu View
        menuButton.addEventListener('click', () => {
            if (hiddenSideMenu) {
                showSideMenu()
                localStorage.setItem('hiddenSideMenu', 'nothidden')
            }
            else {
                hideSideMenu(); 
                localStorage.setItem('hiddenSideMenu', 'hidden')
            }

            hiddenSideMenu = !hiddenSideMenu

        })

        function showSideMenu() {
            sideMenu.style.width = '135px'
            sectionBody.style.marginLeft = '140px'
            bottomSection.style.width = 'calc(100% - 150px)'
            sideMenu.querySelectorAll('button').forEach(button => button.style.width = '130px')

            addNewProjectButton.innerHTML = addNewProjectButton.innerHTML + 'New Project'
            openButton.innerHTML = openButton.innerHTML + 'Open Project'
            deleteButton.innerHTML = deleteButton.innerHTML + 'Delete Project'
            newActivityButton.innerHTML = newActivityButton.innerHTML + 'Add Activity'
            deleteActivityButton.innerHTML = deleteActivityButton.innerHTML + 'Delete Activity'
            runButton.innerHTML = runButton.innerHTML + 'Run Schedule'
        }

        function hideSideMenu() {
            sideMenu.style.width = '45px'
            sectionBody.style.marginLeft = '50px'
            bottomSection.style.width = 'calc(100% - 60px)'
            sideMenu.querySelectorAll('button').forEach(button => button.style.width = '45px')

            addNewProjectButton.innerHTML = addNewProjectButton.innerHTML.replace('New Project', '')
            openButton.innerHTML = openButton.innerHTML.replace('Open Project', '')
            deleteButton.innerHTML = deleteButton.innerHTML.replace('Delete Project', '')
            newActivityButton.innerHTML = newActivityButton.innerHTML.replace('Add Activity', '')
            deleteActivityButton.innerHTML = deleteActivityButton.innerHTML.replace('Delete Activity', '')
            runButton.innerHTML = runButton.innerHTML.replace('Run Schedule', '')
        }

        // Add new project pop-up window
        const newProjectWindow = document.getElementById('newprojectwindow')
        addNewProjectButton.onclick = () => {
            show(newProjectWindow);
            show(overlay)
        }

        // Open Project
        openButton.addEventListener('click', () => {
            const checkedboxes = document.querySelectorAll('input[type="checkbox"]:checked')
            if (checkedboxes.length === 1) {

                localStorage.setItem('tab_id', 'tabGenerals') // Set State
                
                const checkedbox = document.querySelector('input[type="checkbox"]:checked')
                window.location.href = `/activities/${checkedbox.id}`

                //Store Active Project Id
                localStorage.setItem('project_id', `${checkedbox.id}`)

            }
        })

        // Delete Project
        deleteButton.addEventListener('click', deleteProject)


    } // End of Side Menu  -------------------------------------------------------------------------------------------------


    // PROJECTS SECTION  ---------------------------------------------------------------------------------------------------
    if (section && section.id == 'projects') {
        const projectsLink = document.querySelector('#projects-link')
        projectsLink.className = 'button-top-menu-selected' // Set Projects Tab class to selected

        // Disable elements
        const generalTab = document.querySelector('#tabGeneral')
        document.querySelectorAll('#tabGeneral input').disabled = true
        newActivityButton.style.color = 'grey'
        deleteActivityButton.style.color = 'grey'
        runButton.style.color = 'grey'



    } // End of Projects Section  ------------------------------------------------------------------------------------------


    // ACTIVITIES SECTION  --------------------------------------------------------------------------------------------------
    if (section && section.id == 'activities') {
        const projectId = document.querySelector('#activity_project').getAttribute('name')
        const activityId = document.querySelector('#activity-id-input')
        var activityRows = document.querySelectorAll('.activityrow')
        const topBar = document.querySelectorAll('.window-top-bar')
        const activitiesLink = document.querySelector('#activities-link')

        activitiesLink.className = 'button-top-menu-selected' // Set Activities Tab class to selected

        // Add New Activity
        newActivityButton.addEventListener('click', () => {
            addNewActivity()
            activityRows = document.querySelectorAll('.activityrow')
        })
        
        // Selected Activity State
        //if(state_selectedActivity) {document.querySelector(`#${state_selectedActivity}`).className = 'selected-row'}
        
        // Select Activity
        let selectedRow;
        activityRows.forEach(row => row.addEventListener('click', () => {
            activityRows.forEach(row => row.className="activityrow")
            row.className = 'selected-row'
            console.log(`Selected Activity: ${row.id}`)

            // Store seleceted activity state
            //localStorage.setItem('activityrow', `${row.id}`)

            // Enable disabled elements
            assignPredecessorButton.disabled = false
            assignSuccessorButton.disabled = false
            deleteActivityButton.disabled = false
            document.querySelector('#activity-id-input').disabled = false
            document.querySelector('#activity-name-input').disabled = false
            document.querySelector('#original-duration-input').disabled = false
            document.querySelector('#remaining-duration-input').disabled = false
            document.querySelector('#actual_start_input').disabled = false
            document.querySelector('#actual_finish_input').disabled = false
            document.querySelector('#progress_input').disabled = false
            document.querySelector('#start_check').disabled = false
            document.querySelector('#finish_check').disabled = false

            // Create and edit content for bottom tab menus
            showContent(projectId, row.id)
            showRelations(projectId, row.id) // Edits Relations also

            // Set Selected Row
            selectedRow = row

        }))

        // Disable Side Menu Elements
        openButton.style.color = 'grey'
        deleteButton.style.color = 'grey'

        // Edit Generals Tab -----------------------------------------------------
        // Activity ID
        const activityIdInput = document.querySelector('#activity-id-input')
        let activityIdCell
        
        let activityIdList =[]
        for (let i=0; i < activityRows.length; i++) {activityIdList.push(activityRows[i].id)}
        //console.log(activityIdList)

        activityIdInput.addEventListener('click', () =>  {
            //console.log(activityNameInput.value)
            activityIdCell = document.querySelector(`td[name="${activityId.value}"][id="${activityIdInput.value}"]`)
            
        })
        // Red color for Unique Id Check
        activityIdInput.addEventListener('input', (event) =>  {
            activityIdCell.textContent = event.target.value
            if (activityIdList.indexOf(activityIdInput.value)!== -1) {activityIdInput.style.color = 'red'}  
            else {activityIdInput.style.color = 'black'} 
        })
        // Id Check
        activityIdInput.addEventListener('change', () =>  {
            // Unique Id Check
            if (activityIdList.indexOf(activityIdInput.value)!== -1) {
                warning("Please enter a unique Id")
                // Set Initial Values
                activityIdInput.value = selectedRow.id
                activityIdCell.textContent =  selectedRow.id
                activityIdInput.style.color = 'black'
            }
            // Empty Id Check
            else if (activityIdInput.value === "") {
                warning("Please enter a value for Id")
                // Set Initial Values
                activityIdInput.value = selectedRow.id
                activityIdCell.textContent =  selectedRow.id
            }
            
            // Edit Id if Id is Unique
            else {
                editActivity("activity_id", selectedRow.id, projectId, activityIdInput.value)
                activityIdCell.id = activityIdInput.value
                activityIdCell.setAttribute('name', `${activityIdInput.value}`)
                selectedRow.id = activityIdInput.value
                console.log("Edited")
                
                // Store seleceted activity state
                localStorage.setItem('activityrow', `${activityIdInput.value}`)
            }
            


        })
        
        // Activity Name
        const activityNameInput = document.querySelector('#activity-name-input')
        let activityNameCell
        let ganttBarName
        activityNameInput.addEventListener('click', () =>  {
            //console.log(activityNameInput.value)
            activityNameCell = document.querySelector(`td[name="${activityId.value}"][id="${activityNameInput.value}"]`)
            ganttBarName = document.querySelector(`div[id="${activityId.value}"][class="bar-name"]`)
        })
        activityNameInput.addEventListener('input', (event) =>  {
            activityNameCell.textContent = event.target.value 
            ganttBarName.innerHTML = event.target.value  
        })
        activityNameInput.addEventListener('change', () =>  {
            if (activityNameInput.value === "") {
                warning("Please enter an activity name")
                activityNameCell.textContent = selectedRow.getAttribute('name')
                activityNameInput.value = selectedRow.getAttribute('name')
                ganttBarName.innerHTML = selectedRow.getAttribute('name')
                console.log(selectedRow)
            }
            else {
                editActivity("name", activityId.value, projectId, activityNameInput.value)
                activityNameCell.id = activityNameInput.value
                selectedRow.setAttribute('name', activityNameInput.value)
                //console.log("Eited")
            }
        })
        
        // Original Duration
        const activityODInput = document.querySelector('#original-duration-input')
        let activityODCell
        activityODInput.addEventListener('click', () =>  {
            //console.log(activityODInput.value)
            activityODCell = selectedRow.querySelector('td#original_duration')
        })
        activityODInput.addEventListener('input', (event) =>  {
            activityODCell.textContent = event.target.value  
        })
        activityODInput.addEventListener('change', () =>  {
            if (activityODInput.value === "") {
                warning("Please enter a valid duration")
                activityODCell.textContent = 1
                activityODInput.value = 1
            }
            else {
                activityODCell.textContent = activityODInput.value
                editActivity("original_duration", activityId.value, projectId, activityODInput.value)
                //console.log(activityODCell)
            }
        })

        // Remaining Duration
        const activityRDInput = document.querySelector('#remaining-duration-input')
        let activityRDCell
        activityRDInput.addEventListener('click', () =>  {
            //console.log(activityRDInput.value)
            activityRDCell = selectedRow.querySelector('td#remaining_duration')
        })
        activityRDInput.addEventListener('input', (event) =>  {
            activityRDCell.textContent = event.target.value  
        })
        activityRDInput.addEventListener('change', () =>  {
            if (activityRDInput.value === "") {
                warning("Please enter a valid duration")
                activityRDCell.textContent = 1
                activityRDInput.value = 1
            }
            else {
                activityRDCell.textContent = activityRDInput.value
                editActivity("remaining_duration", activityId.value, projectId, activityRDInput.value)
                //console.log(activityODCell)
            }
        })

        // End of Edit Generals Tab -------------------------------------------------


        // Delete Activity
        deleteActivityButton.onclick = () => {
            const activityRowSelected = document.querySelectorAll('.selected-row')

            deleteActivity(projectId, activityId.value)
            activityRowSelected.forEach(row => row.remove())
            

        }


        // Assign Relations
        // Assignment Window
        const assignmentWindow = document.querySelector('#assignrelationwindow') 
        //const closeButton = document.querySelectorAll('#closebutton')
        //closeButton.forEach(button => button.addEventListener('click', closeWindow))

        // Assign Predecessor
        const assignPredecessorButton = document.querySelector('#assignpredecessor')
        assignPredecessorButton.disabled=true
        assignPredecessorButton.onclick = () => {assignRelation('predecessor')}

        // Assign Successor
        const assignSuccessorButton = document.querySelector('#assignsuccessor')
        assignSuccessorButton.disabled=true
        assignSuccessorButton.onclick = () => {assignRelation('sucessor')}

        function assignRelation (relation) {
            // Show Assignment Window
            show(assignmentWindow)
            if (relation == 'predecessor') {
                document.querySelector('#windowtitle1').innerHTML = "Assign Predecessors"
            } else {
                document.querySelector('#windowtitle1').innerHTML = "Assign Sucessors"
            }

            // Select Activity from assignment window and Assign
            const activityRows = document.querySelectorAll('.activityrow2')
            const addAssignmentButton = document.querySelector('#addassignmentbutton')
            activityRows.forEach(row => row.addEventListener('click', () => {
                // Selected activity background color change
                activityRows.forEach(row => row.className="activityrow2")
                row.className = 'selected-row2'  
                console.log(row.id)

                // Enable assignment button
                addAssignmentButton.disabled=false
                //Disable assignment button if selected predecessor is activity itself
                if (row.id === selectedRow.id) {addAssignmentButton.disabled=true}
                    
                // Assign Predecessor or Successor
                addAssignmentButton.onclick = () => {
                    //console.log(projectId, activityId.value, row.id)
                    if (relation == 'predecessor') {assignPredecessor(projectId, activityId.value, row.id)}
                    else {assignSuccessor(projectId, activityId.value, row.id)}
                    
                }

            }))
        }

        // Move Pop-Up Windows
        let x = 0;
        let y = 0;
        topBar.forEach(bar => bar.addEventListener('mousedown', mouseDownHandler))

        
        // Delete Relations
        // Predecessor
        const removePButton = document.querySelector('#removepredecessor')
        removePButton.disabled=true
        removePButton.onclick = () => {
            const relationRowSelected = document.querySelector('.relationrow-selected')
            if (relationRowSelected) {
                deleteRelation(projectId, activityId.value, relationRowSelected.id)
                relationRowSelected.remove()
            }
        }
        //Successor
        const removeSButton = document.querySelector('#removesuccessor')
        removeSButton.disabled=true
        removeSButton.onclick = () => {
            const relationRowSelected = document.querySelector('.relationrow-selected')
            if (relationRowSelected) {
                deleteRelation(projectId, activityId.value, relationRowSelected.id)
                relationRowSelected.remove()
            }
        }


        // Run Schedule
        runButton.onclick = () => {
            console.log('Runnning Schedule')
            runSchedule(projectId)
        }

        // Formatting Dates
        const dates = document.querySelectorAll('#start, #finish, #late_start, #late_finish, #actual_start, #actual_finish')
        dates.forEach(date => {
            const newdate = new Date(date.innerHTML)
            const formattedDate = newdate.toLocaleDateString('en-GB')
            if (formattedDate == 'Invalid Date') {date.innerHTML = ''}
            else {date.innerHTML = formattedDate}
        })

    }  // End of Activities Section  ----------------------------------------------------------------------------------------

    // GANTT SECTION  -------------------------------------------------------------------------------------------------------
    if (section && section.id == 'activities') {
        const projectId = document.querySelector('#activity_project').getAttribute('name')
        const ganttSection = document.querySelector('.gantt-section')
        const activitiesSection = document.querySelector('.activities-section')
        const ganttRows = document.querySelectorAll('.gantt-rows')
        const ganttBars = document.querySelectorAll('.gantt-bar')
        var projectStartDate = document.querySelector('#project-start').getAttribute('name')
        var latestDate = document.querySelector('#latestdate').getAttribute('name')
        var projectDuration = parseInt(document.querySelector('#project-duration').getAttribute('name'))
        var intervalWidth = 20
        var intervalBeforeStart = 8
        var intervalAfterFinish = 5

        // Time Scale Header
        const timeHeader1 = document.querySelector('#gantt-time-header1')
        var timeHeaderStart = new Date(projectStartDate)
        var months = ['January','February', 'March', 'April', 'May',
            'June', 'July','August', 'September', 'October', 'Novovember', 'December']

        for (let i=-intervalBeforeStart; i < projectDuration + intervalAfterFinish ; i++) {
            var date = new Date(projectStartDate)
            date.setDate(date.getDate() + i)
            
            const interval = document.createElement('div')
            interval.className = "time-interval"
            //interval.innerHTML = i + 1
            interval.style.width = `${intervalWidth}px`
            interval.style.display = 'flex'
            interval.style.flexDirection = 'column'
            timeHeader1.append(interval)

            // Years (not visible, only for merged header)
            const yearLabel = document.createElement('div')
            yearLabel.innerHTML = date.getFullYear()
            yearLabel.id = 'years'
            yearLabel.style.height = '50%'
            yearLabel.style.display = 'none'
            interval.append(yearLabel)

            // Months (not visible, only for merged header)
            const monthLabel = document.createElement('div')
            monthLabel.innerHTML = months[date.getMonth()]
            monthLabel.id = 'months'
            monthLabel.style.height = '50%'
            monthLabel.style.display = 'none'
            interval.append(monthLabel)

            // Days
            const dayLabel = document.createElement('div')
            dayLabel.innerHTML = date.getDate()
            dayLabel.className = 'days'
            interval.append(dayLabel)

        }

        // Months Merged 
        const monthDivs = document.querySelectorAll('#months')
        const timeHeader2 = document.querySelector('#gantt-time-header2')

        let previousmonthend = 0;
        for (let i=1; i < monthDivs.length; i++) {

            if (monthDivs[i].innerHTML != monthDivs[i-1].innerHTML) {
                const monthDiv = document.createElement('div')
                monthDiv.innerHTML = monthDivs[i-1].innerHTML
                monthDiv.style.width = `${intervalWidth * (i - previousmonthend)}px`
                monthDiv.className = 'months'
                timeHeader2.append(monthDiv)

                previousmonthend = (i)
            }

            // Condition for last month of timescale
            if (i+1 == monthDivs.length) {
                const monthDiv = document.createElement('div')
                monthDiv.innerHTML = monthDivs[i].innerHTML
                monthDiv.style.width = `${intervalWidth * (i+1 - previousmonthend)}px`
                monthDiv.className = 'months'
                timeHeader2.append(monthDiv)
            }

        }

        // Years Merged 
        const yearDivs = document.querySelectorAll('#years')
        const timeHeader3 = document.querySelector('#gantt-time-header3')

        let previousyearend = 0;
        for (let i=1; i < yearDivs.length; i++) {

            if (yearDivs[i].innerHTML != yearDivs[i-1].innerHTML) {
                const yearDiv = document.createElement('div')
                yearDiv.innerHTML = yearDivs[i-1].innerHTML
                yearDiv.style.width = `${intervalWidth * (i - previousyearend)}px`
                yearDiv.className = 'years'
                timeHeader3.append(yearDiv)

                previousyearend = (i)
            }

            // Condition for last year of timescale
            if (i+1 == yearDivs.length) {
                const yearDiv = document.createElement('div')
                yearDiv.innerHTML = yearDivs[i].innerHTML
                yearDiv.style.width = `${intervalWidth * (i+1 - previousyearend)}px`
                yearDiv.className = 'years'
                timeHeader3.append(yearDiv)
            }

        }

        // Equalize Timescale height and activity table head height
        const timeHeader = document.querySelector('#gantt-time-header')
        const activityTableHead = document.querySelector('#activitytable-head')
        activityTableHead.style.height = getComputedStyle(timeHeader).height
        

        // Activity Bars
        ganttRows.forEach(row =>  {
            createGanttBars(projectId, row.id, row, intervalWidth, timeHeaderStart, intervalBeforeStart)
            // Sizing Gantt Rows
            row.style.width = `${(intervalBeforeStart + projectDuration + intervalAfterFinish)* intervalWidth}px`
        })

        // Project Start Line
        const projectStartLine = document.createElement('div')
        projectStartLine.className = "start-line"
        projectStartLine.style.left = `${intervalBeforeStart * intervalWidth}px`
        ganttSection.append(projectStartLine)
        
        // Project Finish Line
        const projectFinishLine = document.createElement('div')
        projectFinishLine.className = "finish-line"
        projectFinishLine.style.left = `${(intervalBeforeStart + projectDuration) * intervalWidth}px`
        ganttSection.append(projectFinishLine)

        // Scroll Activities Section with Gantt Section
        ganttSection.addEventListener('scroll', () => {
            activitiesSection.scrollTop = ganttSection.scrollTop
        })

        // Resize Sections
        const verticalSeperator = document.querySelector('.vertical-seperator')
        const body = document.querySelector('.body')
        var startX, startWidth;
        
        verticalSeperator.addEventListener('mousedown', (event) => {
            event.preventDefault()
            
            startX = event.clientX;
			startWidth = parseInt(getComputedStyle(activitiesSection).width);
			
            document.addEventListener('mousemove', resizeSections);
			document.addEventListener('mouseup', resizeSectionsEnd);
        })
        
        function resizeSections(event) {
			var diffX = event.clientX - startX;
			activitiesSection.style.width = (startWidth + diffX) + 'px';
			ganttSection.style.width = 'calc(100% - ' + (startWidth + diffX) + 'px)';

            //Fix the flickering issue
            verticalSeperator.style.cursor = 'col-resize'
            document.body.style.cursor = 'col-resize'
		}
		
		function resizeSectionsEnd(event) {
			document.removeEventListener('mousemove', resizeSections);
			document.removeEventListener('mouseup', resizeSectionsEnd);

            verticalSeperator.style.removeProperty('cursor');
            document.body.style.removeProperty('cursor')
        }

    }  // End of Gantt Section  ---------------------------------------------------------------------------------------------

    
    // POP-UP WINDOWS -------------------------------------------------------------------------------------------------------
    if (section) {
        // Move Pop-Up Windows
        const topBar = document.querySelectorAll('.window-top-bar')
        let x = 0;
        let y = 0;
        topBar.forEach(bar => bar.addEventListener('mousedown', mouseDownHandler)) 
        // Close Pop-Up Windows
        const closeButton = document.querySelectorAll('#closebutton')
        closeButton.forEach(button => button.addEventListener('click', closeWindow))
    } // End of Gantt Section  ---------------------------------------------------------------------------------------------
    

}) // End of Main Event Listener




// FUNCTIONS ---------------------------------------------------------------------------------------------------------------
function show(item) {item.style.display = 'block'}
function hide(item) {item.style.display = 'none'}
function daysBetween(first, second) {

    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());


    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;

    return days;
}
function closeWindow (event) {
    const closeButton = event.target
    const overlay = document.querySelector('#overlay')
    const window = closeButton.parentNode.parentNode
    hide(window)
    hide(overlay)
}

function warning(message) {
    const warningWindow = document.querySelector('#warningwindow')
    show(warningWindow)
    show(overlay)
    document.querySelector('#message2').innerHTML = message
}

function confirmation(message) {
    const confirmationWindow = document.querySelector('#confirmationwindow')
    show(confirmationWindow)
    show(overlay)
    document.querySelector('#message').innerHTML = message
}

function disableElements (elementlist) {
    elementlist.forEach(element => element.disabled = true)
}

function enableElements (elementlist) {
    elementlist.forEach(element => element.disabled = false)
}

//  Side Menu
function deleteProject() {
    
    const checkedboxes = document.querySelectorAll('input[type="checkbox"]:checked')

    if (checkedboxes.length > 0) {
        const confirmationButton = document.querySelector('#yes')
        confirmation("Are you sure you want ot delete selected project(s)?")

        confirmation.onclick = () => {
            checkedboxes.forEach(box => {
                fetch('/deleteproject',{
                    method : 'POST',
                    headers: {
                        "X-CSRFToken" : document.querySelector('.csrf_token').value,
                    },
                    body: JSON.stringify({
                        project_id : box.id,
                    })
                })    
                    .then(response => response.json())
                    .then(result => {
                        window.location.reload(true);
                        console.log(result)
                    })
            })   
        }
    }  
}

function editProject (contenttoedit, project_id, content) {
    fetch('/editproject',{
        method : 'POST',
        headers: {
            "X-CSRFToken" : document.querySelector('.csrf_token').value,
        },
        body: JSON.stringify({
            project_id : project_id,
            contenttoedit : contenttoedit,
            content: content,
        })
    })    
        .then(response => response.json())
        .then(result => {
            //window.location.reload(true);
            console.log(result)
        })    
}


function addNewActivity() {

    const projectId = document.querySelector('#activity_project').getAttribute('name')

    fetch('/addnewactivity', {
        method: 'POST',
        headers: {
            "X-CSRFToken" : document.querySelector('.csrf_token2').id,
        },
        body: JSON.stringify({
            project_id : projectId,
        })
    })
    .then(response => response.json())
    .then(result => {
        //console.log(result)

        const content = JSON.parse(result)

        // Activity Id 
        const id = document.createElement('td')
        id.innerHTML = content[0].fields.activity_id
        // Activity Name
        const name = document.createElement('td') 
        name.innerHTML = content[0].fields.name
        // Original Duration
        const od = document.createElement('td')
        od.innerHTML = 5
        // Remainig Duration
        const rd = document.createElement('td')
        rd.innerHTML = 5
        // Actual Duration
        const ad = document.createElement('td')
        ad.innerHTML = 5
        // Toatal Float
        const tf = document.createElement('td')
        tf.innerHTML = 0
        // Free Float
        const ff = document.createElement('td')
        ff.innerHTML = 0
        // Start
        const start = document.createElement('td')
        start.innerHTML = content[0].fields.start
        // Finish
        const finish = document.createElement('td')
        finish.innerHTML = content[0].fields.start
        // Late start
        const ls = document.createElement('td')
        ls.innerHTML = content[0].fields.start
        // Late finish
        const lf = document.createElement('td')
        lf.innerHTML = content[0].fields.start
        // Actual Start
        const as = document.createElement('td')
        as.innerHTML = content[0].fields.start
        // Actual Finish
        const af = document.createElement('td')
        af.innerHTML = content[0].fields.start
        // WBS
        const wbs = document.createElement('td')
        wbs.innerHTML = ""
        // Code
        const code = document.createElement('td')
        code.innerHTML = ""



        // Add td element to activity row and activity table
        const activityTable = document.querySelector('#activitytable').querySelector('tbody')
        const activityRow = document.createElement('tr')
        activityRow.id = content[0].fields.activity_id
        activityRow.className = 'activityrow'
        activityRow.setAttribute('name', `${content[0].fields.name}`)
        activityRow.append(id, name, od, rd, start, finish, tf, ff, ls, lf, as, af, ad, wbs, code)
        activityTable.append(activityRow)
        })

        window.location.reload(true)
}

function deleteActivity(project_id, activity_id) {
    fetch('/deleteactivity', {
        method: 'POST',
        headers: {
            "X-CSRFToken" : document.querySelector('.csrf_token2').id,
        },
        body: JSON.stringify({
            project_id: project_id,
            activity_id : activity_id,
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)

        const ganttRow = document.querySelector(`div.gantt-rows#${activity_id}`)
        ganttRow.remove()
    })
}

// Bottom Menu
function showContent(project_id, activity_id) {
    //console.log(project_id, activity_id)
    fetch ('/showcontent', {
        method : 'POST',
        headers: {
            "X-CSRFToken" : document.querySelector('.csrf_token').id,
        },
        body: JSON.stringify({
            project_id: project_id,
            activity_id : activity_id,
        })
    })
    .then(response => response.json())
    .then(result => {
        //console.log(result)

        const activityContent = JSON.parse(result)

        //Activity Generals Tab Content
        //document.querySelector('#project-name2-input').value = activityContent[0].fields.name
        document.querySelector('#activity-id-input').value = activityContent[1].fields.activity_id
        document.querySelector('#activity-name-input').value = activityContent[1].fields.name

        //Status Tab
        document.querySelector('#original-duration-input').value = activityContent[1].fields.original_duration
        document.querySelector('#remaining-duration-input').value = activityContent[1].fields.remaining_duration
        document.querySelector('#actual_start_input').value = activityContent[1].fields.start
        document.querySelector('#actual_finish_input').value = activityContent[1].fields.finish
        document.querySelector('#progress_input').value = activityContent[1].fields.progress
        


    })


}

function showRelations(project_id, activity_id) {
    //console.log(project_id, activity_id)
    fetch ('/showrelations', {
        method : 'POST',
        headers: {
            "X-CSRFToken" : document.querySelector('.csrf_token').id,
        },
        body: JSON.stringify({
            project_id: project_id,
            activity_id : activity_id,
        })
    })
    .then(response => response.json())
    .then(result => {
        //console.log(result)

        // Removing existing predecessor rows form relations menu
        var predecessors = document.querySelectorAll('tr[name="predecessors"]')
        if(predecessors) {
            for (let i=0; i<predecessors.length; i++) {predecessors[i].remove()}
        }
        // Removing existing successor rows form relations menu
        var successors = document.querySelectorAll('tr[name="successors"]')
        if(successors) {
            for (let i=0; i<successors.length; i++) {successors[i].remove()}
        }

        // Creating predecessor and sucessor rows for selected activity
        for (let i=0; i<result.length; i++) {
            createRelationRow(result[i])
            //console.log(result[i])
        }
        
        // Select relation rows
        const relationRows = document.querySelectorAll('.relationrow')
        relationRows.forEach(relationrow => relationrow.addEventListener('click', () => {
            relationRows.forEach(relationrow => relationrow.className="relationrow")
            relationrow.className = "relationrow-selected"

            // Enable Remove buttons
            if (relationrow.getAttribute('name') == 'predecessors') {
                document.querySelector('#removepredecessor').disabled=false
                document.querySelector('#removesuccessor').disabled=true
            } else {
                document.querySelector('#removesuccessor').disabled=false
                document.querySelector('#removepredecessor').disabled=true
            }

            // Edit Predecessors - Relation Type
            const relationTypes = document.querySelectorAll('#relationtype')
            relationTypes.forEach(relationType => relationType.addEventListener('change', () => {
                //console.log(relationType.value)
                //console.log(activity_id,relationrow.id)

                fetch('/editrelation',{
                    method: 'POST',
                    headers: {
                        "X-CSRFToken" : document.querySelector('.csrf_token').id,
                    },
                    body: JSON.stringify({
                        //activity_id: activity_id,
                        //predecessor_id: relationrow.id,
                        relation_id: relationrow.id,
                        relation_type: relationType.value,
                    })
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result)

                })
            }))

            // Edit Predecessors - Lag
            const lagInputs = document.querySelectorAll('#lag')
            lagInputs.forEach(lagInput  => lagInput.addEventListener('change', () => {
                //console.log(relationType.value)
                //console.log(activity_id,relationrow.id)

                fetch('/editrelation',{
                    method: 'POST',
                    headers: {
                        "X-CSRFToken" : document.querySelector('.csrf_token').id,
                    },
                    body: JSON.stringify({
                        //activity_id: activity_id,
                        //predecessor_id: relationrow.id,
                        relation_id: relationrow.id,
                        lag: lagInput.value,
                    })
                })
                .then(response => response.json())
                .then(result => {
                    console.log(result)

                })
            }))

            
        }))
        
        
    })
}

function createRelationRow(result) {

    // Activity Id 
    const activityId = document.createElement('td')
    activityId.innerHTML = result.activity_id

    // Activity Name
    const activityName = document.createElement('td')
    activityName.innerHTML = result.name
    
    // Activity Relation Type
    const activityRType = document.createElement('td')
        const select = document.createElement('select')
        
        select.className = 'relationselect'
        //if (result.description == 'predecessor') {select.id = 'relation_predecessor'}
        //else {select.id = 'relation_successor'}
        select.id = 'relationtype'
            const option1 = document.createElement('option')
            option1.value= 'FS'
            option1.innerHTML= 'FS'
            const option2 = document.createElement('option')
            option2.value= 'SS'
            option2.innerHTML= 'SS'
            const option3 = document.createElement('option')
            option3.value= 'FF'
            option3.innerHTML= 'FF'
        select.append(option1, option2, option3)
        select.value = result.relation
    activityRType.append(select)

    // Activity Lag
    const activityLag = document.createElement('td')
    const input = document.createElement('input')
    input.type = 'number'
    if (result.description == 'predecessor') {input.className = 'predecessor_lag_input'}
    else {input.className = 'successor_lag_input'}
    input.id = 'lag'
    input.value = result.lag
    activityLag.append(input)
    
    // Activity Start
    const activityStart = document.createElement('td')
    activityStart.innerHTML = result.start
    
    // Activity Finish
    const activityFinish = document.createElement('td')
    activityFinish.innerHTML = result.finish

    // Driving Status
    const driving = document.createElement('td')
  

    // Critical Status
    const critical = document.createElement('td')
    critical.style.textAlign = 'center'
    if (result.critical == true) {
        critical.innerHTML = '&#10003;'
    }
    
    // Add td element to activity row and predecessor/sucessor table
    const predecessorTable = document.querySelector('#predecessortable')
    const successorTable = document.querySelector('#successortable')
    const activityRow = document.createElement('tr')
    
    activityRow.id = result.id
    activityRow.className = 'relationrow'
    if (result.description == 'predecessor') {activityRow.setAttribute('name', 'predecessors')}
    else {activityRow.setAttribute('name', 'successors')}
    
    activityRow.append(activityId, activityName, activityRType, activityLag, activityStart, activityFinish, driving, critical)
    
    if (result.description == 'predecessor') {predecessorTable.append(activityRow)}
    else {successorTable.append(activityRow)}
}

function assignPredecessor(project_id, activity_id, predecessor_id) {
  
    fetch ("/assignpredecessor", {
        method: 'POST',
        headers: {
            "X-CSRFToken" : document.querySelector('.csrf_token').id,
        },
        body: JSON.stringify({
            project_id : project_id,
            activity_id: activity_id,
            predecessor_id: predecessor_id,
        })
    })
    .then(response => response.json())
    .then(predecessor => {
        // Add raletion raw to predecessor table
        showRelations(project_id, activity_id)      
    })
}

function assignSuccessor(project_id, activity_id, successor_id) {
  
    fetch ("/assignsuccessor", {
        method: 'POST',
        headers: {
            "X-CSRFToken" : document.querySelector('.csrf_token').id,
        },
        body: JSON.stringify({
            project_id : project_id,
            activity_id: activity_id,
            successor_id: successor_id,
        })
    })
    .then(response => response.json())
    .then(sucessor => {
        // Add raletion raw to predecessor table
        showRelations(project_id, activity_id)      
    })
}

function deleteRelation(project_id, activity_id, relation_id) {
    fetch ("/deleterelation", {
        method: 'POST',
        headers: {
            "X-CSRFToken" : document.querySelector('.csrf_token').id,
        },
        body: JSON.stringify({
            relation_id: relation_id,
        })
    })
    .then(response => response.json())
    .then(result => {
        showRelations(project_id, activity_id)      
    })
}

function runSchedule(project_id) {
    fetch ("/runschedule", {
        method: 'POST',
        headers: {
            "X-CSRFToken" : document.querySelector('.csrf_token').id,
        },
        body: JSON.stringify({
            project_id: project_id,
        })
    })
    .then(response => response.json())
    .then(result => {
        //window.location.reload(true)
        console.log(result)      
    })
}

function editActivity(contenttoedit, activity_id, project_id, content) {
    fetch('/editactivity',{
        method : 'POST',
        headers: {
            "X-CSRFToken" : document.querySelector('.csrf_token2').id,
        },
        body: JSON.stringify({
            project_id: project_id,
            activity_id : activity_id,
            contenttoedit: contenttoedit,
            content: content,
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)
        
    })
}

// Gantt Chart
function createGanttBars(
        project_id,
        activity_id,
        activityrow,
        intervalWidth,
        timeHeaderStart,
        intervalBeforeStart,
        )    
    {   fetch ('/showcontent', {
            method : 'POST',
            headers: {
                "X-CSRFToken" : document.querySelector('.csrf_token').id,
            },
            body: JSON.stringify({
                project_id: project_id,
                activity_id : activity_id,
            })
        })
    .then(response => response.json())
    .then(result => {
        //console.log(result)
        const activityContent = JSON.parse(result)

        // Varaibles
        let originalDuration =(activityContent[1].fields.original_duration)
        let duration = (activityContent[1].fields.remaining_duration)
        let barStart = new Date(activityContent[1].fields.start)
        let leftMargin = (daysBetween(timeHeaderStart, barStart) + intervalBeforeStart )* intervalWidth
        
        // Create Gannt Bar
        const ganttBar = document.createElement('div')
        if (activityContent[1].fields.critical == true) {ganttBar.className = "gantt-bar-critical"}
        else {ganttBar.className = "gantt-bar"}
        ganttBar.id = activityContent[1].fields.activity_id
        if (originalDuration == 0) {
            ganttBar.innerHTML = '<i class="fa-solid fa-diamond fa-xl"></i>'
            ganttBar.className = 'milestone'
        }
        else {ganttBar.style.width = `${intervalWidth * duration}px`}
        ganttBar.style.left = `${leftMargin }px`
        activityrow.append(ganttBar)

        // Gantt Bar Descriptions
        // Start Date
        const start = new Date(activityContent[1].fields.start).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        const startDiv = document.createElement('div')
        startDiv.style.position = 'relative'
        startDiv.style.left = `${leftMargin - (intervalWidth * duration) - 35 }px` // Bar's left margin minus bar width
        startDiv.style.width = '40px'
        if (originalDuration == 0) {startDiv.innerHTML = ''}
        else {startDiv.innerHTML = start}
        activityrow.append(startDiv)
        
        // Finish Date
        const finish = new Date(activityContent[1].fields.finish).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
        const finishDiv = document.createElement('div')
        finishDiv.style.position = 'relative'
        finishDiv.style.left = `${leftMargin - 35 }px`
        finishDiv.style.width = '40px'
        finishDiv.innerHTML = finish   
        activityrow.append(finishDiv)
        
        // Activity Name
        const name = activityContent[1].fields.name
        const nameDiv = document.createElement('div')
        nameDiv.id = activityContent[1].fields.activity_id
        nameDiv.className = 'bar-name'
        nameDiv.style.position = 'relative'
        nameDiv.style.textAlign = 'right'
        nameDiv.innerHTML = `${name}, `
        activityrow.append(nameDiv)
        const nameWidth = nameDiv.offsetWidth
        if (originalDuration == 0) {nameDiv.style.left = `${leftMargin - (intervalWidth * duration) - nameWidth - 100 }px`}
        else {nameDiv.style.left = `${leftMargin - (intervalWidth * duration) - nameWidth - 120 }px`} // Bar's left margin minus bar width

        
    })
}


// Drag Windows , ref: https://htmldom.dev/make-a-draggable-element/
function mouseDownHandler (e) {
    e.preventDefault()
    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;

    // Attach the listeners to `document`
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
};

function mouseMoveHandler (e) {
    e.preventDefault()
    const element = e.target.parentNode 
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    // Set the position of element
    element.style.top = `${element.offsetTop + dy}px`;
    element.style.left = `${element.offsetLeft + dx}px`;

    // Reassign the position of mouse
    x = e.clientX;
    y = e.clientY;
}

function mouseUpHandler () {
    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
}


