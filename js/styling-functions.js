$(document).on('mousedown', '.plantOption',function(e) {
    var isEnabled = $('#plants').disabled;
    if(isEnabled)
    {
        e.preventDefault();
        var originalScrollTop = $(this).parent().scrollTop();
        console.log(originalScrollTop);
        $(this).prop('selected', $(this).prop('selected') ? false : true);
        var self = this;
        $(this).parent().focus();
        setTimeout(function() {
            $(self).parent().scrollTop(originalScrollTop);
        }, 0);
    }
        return false;
});

$(document).on('change', '#colors',function()
{
    var color = $('option:selected', this).css('background-color');
    $(this).css('background-color', color);
});
