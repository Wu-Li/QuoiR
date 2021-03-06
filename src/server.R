###Server###
{
    library(shiny)
    library(ggplot2)
    library(pryr)
    library(plyr)
    library(jsonlite)
    library(reshape2)
    library(Ryacas)       
}

shinyServer(function(input, output, session) {
    
###Session###
{
    console <- new.env()
    observe({ console$.SE <- environment(session$sendInputMessage) })
    observe({ console$.ME <- session })
    console$.out <- reactiveValues(
        results = NULL,
        types   = NULL,
        hovers  = NULL,
        widths  = NULL
    )
    source('.//R//utils//helpers.R',local=T)
    source('.//R//CAS.R',local=T)
    clear()    
    pp('--Session: ',begin <- Sys.time())
}

##Panel Controller##
{
    prompt <- reactiveValues(
        commands = c('ls'),
        panel = NA,
        help = NA,
        plot = NA
    )
    observe({ options(width=as.integer(input$panelWidth)-3) })
    observe({ 
        if (input$submit == 0) { return(NULL) }
        entry <- isolate(input$prompt)
        if(is.null(entry) || entry == ''){return(NULL)}
        switch(substr(entry, 1, 1), {
            toConsole(paste0("> ",entry),'in','expression')
            prompt$panel <- 'console'
            evaluate(entry)
        },
        '#' = {
            toConsole(entry,'in','javascript')
            prompt$panel <- 'console'
            entry <- substring(entry, 2)
            class(entry) <- 'JS'
            evaluate.JS(entry)
        },
        '?' = { 
            toConsole(entry,'in','help')
            prompt$panel <- 'help'
            class(entry) <- 'help' 
            evaluate.help(entry)
        })
        #evaluate(entry)
        updateTextInput(session, "prompt", value = "")
        updateTabsetPanel(session, "panels", selected = prompt$panel)
    })
}
##Console##
source('.//R//panels//console.R',local=T)
##Inspector##
source('.//R//panels//inspector.R',local=T)
##Help##
source('.//R//panels//help.R',local=T)
##Database##
source('.//R//qbase.R',local=T)
##Views##
source('.//R//Views.R',local=T) 
##Graphs##
source('.//R//Graphs.R',local=T)

})###