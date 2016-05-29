var internationalizationModule = angular.module('Internationalization', []);


// Internationalization
recetarium.config(['$translateProvider', function($translateProvider) {
    $translateProvider.translations('en', {
        'login.header-title': 'Welcome!',
        'login.btn-register': 'Don\'t you have account? Sign up',
        'login.btn-recover': 'Do you forgive your password?',

        'register.header-title': 'Sign up',
        'register.btn-sign-up': 'Sign up',
        'register.btn-login': 'Do you have an account? Sign in',
        'register.thanks-title': 'Thanks for sign up',
        'register.thanks-text': 'We have sent you an email to validate your account.',

        'logout.title': 'Logout',
        'logout.text': 'See you soon.',

        'reset.header-title': 'Reset your password',
        'reset.btn-send': 'Send email',
        'reset.btn-login' : 'Do you remember? Sign in',

        'recover.header-title': 'Reset your password',
        'recover.btn-send': 'Change password',
        'recover.changed': 'Password changed successfully',

        'active.header-title': 'Activating account',
        'active.actived': 'Account activated successfully',

        'profile.header-title': 'Your profile',
        'profile.personal-data-title': 'Personal data',
        'profile.password-title': 'Change password',
        'profile.recipes-title': 'Your recipes',
        'profile.fav-title': 'Your favorite recipes',
        'profile.images-title': 'Your images',
        'profile.image-text-uploaded': 'Image uploaded ',
        'profile.image-text-count-main': 'Nº of times used as main:',
        'profile.image-text-count-extra': 'Nº of times used as extra:',
        'profile.image-text-count-total': 'Nº total of times used:',
        'profile.friends-title': 'Your friends',

        'user.header-title': '{{ name }} profile',
        'user.personal-data-title': 'Personal data',
        'user.recipes-title': 'Published recipes',
        'user.fav-title': 'Favorite recipes',
        'user.friends-title': 'Friends',

        'friend.added': 'You have added  \'{{ name }}\' as friend.',
        'friend.deleted': 'You have deleted \'{{ name }}\' as friend.',

        'menu.recipes': 'Recipes',
        'menu.last-recipes': 'Last recipes',
        'menu.top-recipes': 'Top recipes',
        'menu.users': 'Users',
        'menu.all-users': 'All the users',
        'menu.friends': 'Friends',
        'menu.write-recipe': 'Write a new recipe',
        'menu.profile': 'Profile',
        'menu.salutation': 'Hi',
        'menu.logout': 'Logout',
        'menu.login': 'Sign in/up',

        'recipe-create.header-title': 'New recipe (draft)',
        'recipe-edit.header-title': 'Edit recipe',

        'dropzone.text': 'Drag and drop the images here',
        'dialog-select.header-title': 'Select an image',
        'dialog-select.title-1': 'Select one of your images ...',
        'dialog-select.title-2': '... or upload a new image',
        'dialog-upload.header-title': 'Upload a new image',
        'dialog.remove-image-1': 'Do you really want to delete the image \'{{ title }}\'?<br>This action can\'t be undo.',
        'dialog.remove-image-2': 'The image disappears from all recipes',
        'dialog.remove-recipe': 'Do you really want to delete the recipe \'{{ title }}\'?<br>This action can\'t be undo.',
        'dialog.remove-comment': 'Do you really want to delete the comment?<br>This action can\'t be undo.<br>The replies also will be deleted.',
        'dialog.publish': 'Do you want publish the recipe \'{{ title }}\'?',
        'dialog-comment.header-title': 'Write a comment',
        'dialog-rating.header-title': 'Rate the recipe',

        'comment.last-update': 'Last modification',
        'comment.created-at': 'Created',

        'share.title':  'Do you see the recipe \'{{ title }}\'?',
        'share.body':  'Check it out: {{ url }}',

        'btn.delete-text': 'Delete',
        'btn.cancel-text': 'Cancel',
        'btn.confirm-text': 'Accept',
        'btn.edit-text': 'Edit',
        'btn.save-text': 'Save',
        'btn.replies-text': 'Replies',
        'btn.comment-text': 'Comment',
        'btn.save-draft': 'Save draft',
        'btn.publish': 'Publish',
        'btn.send-text': 'Send',
        'btn.add-friend-text': 'Add to your friends',
        'btn.delete-friend-text': 'Delete from your friends',
        'btn.select-images': 'Select your images for this recipe',
        'btn.write-comment': 'Write a comment',

        'response.saved': 'Saved',
        'response.published': 'Published',
        'response.added': 'Added',
        'response.deleted': 'Deleted',

        'form.error-required': 'This field is required.',
        'form.error-password': 'The password must be equals.',
        'form.error-email': 'Your email must be between 10 and 100 characters long and look like an e-mail address.',
        'form.error-comment-length': 'The comment must be of 140 characters of less.',
        'form.error-slug': 'This slug already exists. You can enter a new one or replace it, or change the recipe title for self-generate a new.',
        'form.error-duration': 'The duration should be more than 1 min.',

        'error.400.title': 'Wrong data',
        'error.500.title': 'Something went wrong. Please, try it later.',

        'tooltip.image-used-text': 'The image is used in some recipe as main',
        'tooltip.select-image': 'Click the image to select another',
        'tooltip.search-tag': 'Search a tag',
        'tooltip.search-category': 'Select a category',
        'tooltip.slug-info': 'The \'slug\' is a descriptive phrase that extracted of recipe title for use in the web address. It does not affect any of the content.',
        'tooltip.show-comments': 'Show the comments.',

        'placeholder.search': 'Search',

        'field.first-name': 'First name',
        'field.last-name': 'Last name',
        'field.image-main': 'Image main',
        'field.text': 'Text',
        'field.title': 'Title',
        'field.name': 'Name',
        'field.count': 'Count',
        'field.duration': 'Duration',
        'field.num-persons': 'Nº persons',
        'field.difficulty': 'Difficulty',
        'field.visibility': 'Visibility',
        'field.category': 'Category',
        'field.ingredients': 'Ingredients',
        'field.steps': 'Steps',
        'field.images': 'Images',
        'field.password': 'Password',
        'field.comment': 'Comment',
        'field.fav': 'Favorites',
        'field.password-repeat': 'Confirm password',
        'field.remember-me': 'Remember me',
        'field.required-text': 'The fields with * are <u>required</u>.',
        'field.username': 'Username',

        'conjuntion.and': 'and',

        'humanized.EASY': 'Easy',
        'humanized.MEDIUM': 'Medium',
        'humanized.HARD': 'Hard',
        'humanized.PUBLIC': 'Public',
        'humanized.FRIENDS': 'Only friends',
        'humanized.PRIVATE': 'Private',
    });

    $translateProvider.translations('es', {
        'login.header-title': '¡Bienvenido de nuevo!',
        'login.btn-register': '¿No tienes cuenta? Regístrate',
        'login.btn-recover': '¿Has olvidado tu contraseña?',

        'register.header-title': 'Regístrate',
        'register.btn-sign-up': 'Registro',
        'register.btn-login': '¿Tienes cuenta? Logueate',
        'register.thanks-title': 'Gracias por registrarte',
        'register.thanks-text': 'Te hemos enviado un email para validar tu cuenta.',

        'logout.title': 'Adios',
        'logout.text': 'Nos vemos luego.',

        'reset.header-title': 'Resetea tu contraseña',
        'reset.btn-send': 'Enviar email',
        'reset.btn-login' : '¿Te acuerdas? Logueate',

        'recover.header-title': 'Resetea tu contraseña',
        'recover.btn-send': 'Cambiar contraseña',
        'recover.changed': 'Contraseña cambiada con éxito',

        'active.header-title': 'Activando cuenta',
        'active.actived': 'Cuenta activada con éxito',

        'profile.header-title': 'Tu perfil',
        'profile.personal-data-title': 'Datos personales',
        'profile.password-title': 'Cambiar contraseña',
        'profile.recipes-title': 'Tus recetas',
        'profile.fav-title': 'Tus recetas favoritas',
        'profile.images-title': 'Tus imágenes',
        'profile.image-text-uploaded': 'Imagen subida el',
        'profile.image-text-count-main': 'Nº veces usada como principal:',
        'profile.image-text-count-extra': 'Nº veces usada como extra:',
        'profile.image-text-count-total': 'Nº total de veces usada:',
        'profile.friends-title': 'Tus amigos',

        'user.header-title': 'Perfil de {{ name }}',
        'user.personal-data-title': 'Datos personales',
        'user.recipes-title': 'Recetas publicadas',
        'user.fav-title': 'Recetas favoritas',
        'user.friends-title': 'Amigos',

        'friend.added': 'Has añadido a \'{{ name }}\' como amigo.',
        'friend.deleted': 'Has borrado a \'{{ name }}\' como amigo.',

        'recipe-create.header-title': 'Nueva receta (borrador)',
        'recipe-edit.header-title': 'Editar receta',

        'menu.recipes': 'Recetas',
        'menu.last-recipes': 'Últimas recetas',
        'menu.top-recipes': 'Top recetas',
        'menu.users': 'Usuarios',
        'menu.all-users': 'Todos los usuarios',
        'menu.friends': 'Amigos',
        'menu.write-recipe': 'Escribe una receta',
        'menu.profile': 'Perfil',
        'menu.salutation': 'Hola',
        'menu.logout': 'Logout',
        'menu.login': 'Login / Registro',

        'dropzone.text': 'Arrastra y suelta las imágenes aquí',
        'dialog-select.header-title': 'Elige una imagen',
        'dialog-select.title-1': 'Elige una de tus imágenes ...',
        'dialog-select.title-2': '... o sube una nueva imagen',
        'dialog-upload.header-title': 'Sube una nueva imagen',
        'dialog.remove-image-1': '¿De verdad que quieres borrar la imagen \'{{ title }}\'?<br>Esta acción no se puede deshacer.',
        'dialog.remove-image-2': 'La imagen desaparecerá de todas las recetas',
        'dialog.remove-recipe': '¿De verdad que quieres borrar la receta \'{{ title }}\'?<br>Esta acción no se puede deshacer.',
        'dialog.remove-comment': '¿De verdad que quieres borrar el comentario?<br>Esta acción no se puede deshacer.<br>Se borrarán las respuestas.',
        'dialog.publish': '¿Quieres publicar la receta \'{{ title }}\'?',
        'dialog-comment.header-title': 'Escribe un comentario',
        'dialog-rating.header-title': 'Puntúa la receta',

        'comment.last-update': 'Ultima modificación el',
        'comment.created-at': 'Creado el',

        'share.title':  '¿Has visto la receta \'{{ title }}\'?',
        'share.body':  'Échale un vistazo: {{ url }}',

        'btn.delete-text': 'Borrar',
        'btn.cancel-text': 'Cancelar',
        'btn.confirm-text': 'Aceptar',
        'btn.save-text': 'Guardar',
        'btn.replies-text': 'Respuestas',
        'btn.comment-text': 'Comentar',
        'btn.save-draft': 'Guardar borrador',
        'btn.publish': 'Publicar',
        'btn.edit-text': 'Editar',
        'btn.send-text': 'Enviar',
        'btn.add-friend-text': 'Añadir a tus amigos',
        'btn.delete-friend-text': 'Borrar de tus amigos',
        'btn.select-images': 'Elige tus imágenes para esta receta',
        'btn.write-comment': 'Escribe un comentario',

        'response.saved': 'Guardado',
        'response.published': 'Publicada',
        'response.added': 'Añadido',
        'response.deleted': 'Borrado',

        'form.error-required': 'Este campo es obligatorio.',
        'form.error-password': 'Las contraseñas deben coincidir.',
        'form.error-email': 'Tu email debe tener entre 10 y 100 caracteres y parecerse a una dirección de e-mail.',
        'form.error-comment-length': 'El comentario debe ser de 140 carácteres o menos.',
        'form.error-slug': 'El slug ya existe. Puedes introducir uno nuevo o cambiarlo por otro, o cambiar el título de la receta para autogenerar otro nuevo.',
        'form.error-duration': 'La duración debe de ser de más de 1 min.',

        'error.400.title': 'Datos incorrectos',
        'error.500.title': 'Ha ocurrido un error. Por favor, intentelo más tarde.',

        'tooltip.image-used-text': 'La imagen se usa en alguna receta como principal',
        'tooltip.select-image': 'Haz click en la imagen para elegir otra',
        'tooltip.search-tag': 'Busca una etiqueta',
        'tooltip.search-category': 'Selecciona una categoría',
        'tooltip.slug-info': 'El \'slug\' es una frase descriptiva extraida del título de la receta para usarla en la direccion web. No afecta a nada del contenido.',
        'tooltip.show-comments': 'Mostrar los comentarios.',

        'placeholder.search': 'Buscar',

        'field.first-name': 'Nombre completo',
        'field.last-name': 'Apellidos',
        'field.image-main': 'Imagen principal',
        'field.text': 'Texto',
        'field.title': 'Título',
        'field.name': 'Nombre',
        'field.count': 'Cantidad',
        'field.duration': 'Duración',
        'field.num-persons': 'Nº personas',
        'field.difficulty': 'Dificultad',
        'field.visibility': 'Visibilidad',
        'field.category': 'Categoría',
        'field.ingredients': 'Ingredientes',
        'field.steps': 'Pasos',
        'field.images': 'Imágenes',
        'field.comment': 'Comentario',
        'field.fav': 'Favoritos',
        'field.password': 'Contraseña',
        'field.password-repeat': 'Confirmar contraseña',
        'field.remember-me': 'Recordar sesión',
        'field.required-text': 'Los campos con * son <u>requeridos</u>.',
        'field.username': 'Nombre del usuario',

        'conjuntion.and': 'y',

        'humanized.EASY': 'Fácil',
        'humanized.MEDIUM': 'Media',
        'humanized.HARD': 'Difícil',
        'humanized.PUBLIC': 'Pública',
        'humanized.FRIENDS': 'Solo amigos',
        'humanized.PRIVATE': 'Privada',
    });

    $translateProvider.registerAvailableLanguageKeys(['en', 'es'], {
        'en_*': 'en',
        'es_*': 'es',
    });

    $translateProvider.useSanitizeValueStrategy('sanitize');

    // Language determined by browser
    $translateProvider.determinePreferredLanguage();
}]);
