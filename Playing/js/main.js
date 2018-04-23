/* */
'use strict'

function highlight(quarter){
    quarter.classList.toggle('highlight');
}

function removeAllhighlight(){
    document.querySelectorAll('.highlight').forEach(function(quarter){
        quarter.classList.remove('highlight');
    })
}
