var textEditorModule = angular.module('TextEditor', []);

textEditorModule.constant('ICONS', {
    'quote': 'format_quote',
    'bold': 'format_bold',
    'italics': 'format_italic',
    'underline': 'format_underline',
    'ul': 'format_list_bulleted',
    'ol': 'format_list_numbered',
    'redo': 'redo',
    'undo': 'undo',
    'clear': 'format_clear',
    'justifyLeft': 'format_align_left',
    'justifyCenter': 'format_align_center',
    'justifyRight': 'format_align_right',
    'justifyFull': 'format_align_justify',
    'html': 'code',
    'insertImage': 'insert_photo',
    'insertLink': 'insert_link'
});

textEditorModule.config(function($provide) {
    $provide.decorator('taOptions', ['$delegate', function(taOptions) {
        taOptions.toolbar = [
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote',
            'bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear',
            'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull',
            'html', 'insertImage', 'insertLink']
        ];
        return taOptions;
    }]);

    $provide.decorator('taTools', ['$delegate', function(taTools) {
        taTools.quote.iconclass = 'material-icons';
        taTools.bold.iconclass = 'material-icons';
        taTools.italics.iconclass = 'material-icons';
        taTools.underline.iconclass = 'material-icons';
        taTools.ul.iconclass = 'material-icons';
        taTools.ol.iconclass = 'material-icons';
        taTools.undo.iconclass = 'material-icons';
        taTools.redo.iconclass = 'material-icons';
        taTools.clear.iconclass = 'material-icons';
        taTools.justifyLeft.iconclass = 'material-icons';
        taTools.justifyRight.iconclass = 'material-icons';
        taTools.justifyCenter.iconclass = 'material-icons';
        taTools.justifyFull.iconclass = 'material-icons';
        taTools.html.iconclass = 'material-icons';
        taTools.insertLink.iconclass = 'material-icons';
        taTools.insertImage.iconclass = 'material-icons';

        return taTools;
    }]);
});
