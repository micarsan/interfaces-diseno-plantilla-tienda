window.addEventListener("load", function () {

    // Blur efect when focus on header search input and animations
    document.querySelector('#searchbox input').addEventListener("focus", function () {

        let header_h1 = document.querySelector('header .header_top h1');

        header_h1.classList.add('blur');

        let available_width = header_h1.offsetWidth + 74;
        let input_width = available_width / 2;
        let input_margin = available_width / 4;

        if (available_width < 550) {
            input_width = available_width - 25;
            input_margin = 0;
        }

        document.querySelector('header #searchbox input').style.width = input_width + 'px';
        document.querySelector('header #searchbox input').style.marginRight = input_margin + 'px';
    });

    document.querySelector('#searchbox input').addEventListener("focusout", function () {

        document.querySelector('header .header_top h1').classList.remove('blur');

        document.querySelector('header #searchbox input').style.width = '';
        document.querySelector('header #searchbox input').style.marginRight = '';

    });


    // User loging box
    document.querySelector('header #userbox').addEventListener('click', function (event) {
        
        // Evitamos la herencia en los hijos
        if (document.querySelector('header #userbox') !== event.target) return;
        
        this.classList.toggle('active');
    } );


    // product gallery
    product_gallery();

    // product gallery full screen image
    let images = document.querySelectorAll('.product-gallery div div img');
    for (let i = 0; i < images.length; i++) {
        images[i].addEventListener('click', function () {
            full_screen_image(i);
        });
    }

});


window.addEventListener("resize", function () {
    // product galleries
    product_gallery();
    full_screen_image_positions_and_proportions();
});


function product_gallery() {

    let galleries = document.querySelectorAll('.product-gallery');
    for (let gallery of galleries) {

        let scrool_width = gallery.querySelector('img').offsetWidth + 20;

        // Image width (full width in mobile portrait)
        let image_width = gallery.querySelector('div').offsetWidth - 4;
        if (image_width < 500) {

            // Check and create if <style data-gallery> not exist
            if (!document.querySelector('style[data-gallery]')) {
                let style = document.createElement('style');
                style.setAttribute('data-gallery', '');
                document.head.appendChild(style);
            }

            let images = gallery.querySelectorAll('img');
            document.querySelector('style[data-gallery]').textContent = '.product-gallery.landscape div div>img, .product-gallery.portrait div div>img { width: ' + image_width + 'px; } ';

            scrool_width = image_width + 20;
        } else {
            if (document.querySelector('style[data-gallery]')) {
                document.querySelector('style[data-gallery]').remove();
            }
        }

        // buttons
        gallery.querySelector('button.left').addEventListener('click', function () {
            gallery.querySelector('div').scrollLeft += -scrool_width;
        });

        gallery.querySelector('button.right').addEventListener('click', function () {
            gallery.querySelector('div').scrollLeft += scrool_width;
        });

        check_swype(gallery);

    }

}

/**
 * Show image in full screen
 */
function full_screen_image(index_key) {

    //Force index_key to integer
    index_key = parseInt(index_key);

    let images = document.querySelectorAll('.product-gallery img');
    if (images.length < 1) return false;
    let image = images[index_key];

    // Get limits of this gallery (exclude other galeries in same page)
    let this_gallery = image.parentNode.parentNode.querySelectorAll('img');
    let first_index_key = 0;
    let last_index_key = this_gallery.length - 1;

    //Get first and last index_key
    for (let i = 0; i < images.length; i++) {
        if (images[i] === this_gallery[0]) {
            first_index_key = i;
        }
        if (images[i] === this_gallery[(this_gallery.length - 1)]) {
            last_index_key = i;
        }
    }


    // Check if base layer exist
    let container = document.querySelector('#full-screen-image');
    if (!document.querySelector('#full-screen-image')) {
        container = document.createElement('div');
        container.id = 'full-screen-image';
        check_swype(container);
    }

    // Check if overlay exist
    let overlay_image = document.querySelector('#overlay_image');
    if (!overlay_image) {

        overlay_image = document.createElement('div');
        overlay_image.id = 'overlay_image';
        overlay_image.classList.add('overlay');
        overlay_image.classList.add('show');

        container.appendChild(overlay_image);
    }

    /// check if buttons exist
    // left
    let left_button = document.querySelector('#full-screen-image button.left');
    if (!left_button) {

        left_button = document.createElement('button');
        left_button.classList.add('left');
        left_button.innerHTML = '&#10132;';
        container.appendChild(left_button);

        left_button.addEventListener('click', function () {
            full_screen_image(left_button.getAttribute('data-index'));
        });
    }

    let prev_index = index_key - 1;
    if (index_key == first_index_key) { prev_index = last_index_key; }
    left_button.setAttribute('data-index', prev_index);


    // right
    let right_button = document.querySelector('#full-screen-image button.right');
    if (!right_button) {

        right_button = document.createElement('button');
        right_button.classList.add('right');
        right_button.innerHTML = '&#10132;';
        container.appendChild(right_button);

        right_button.addEventListener('click', function () {
            full_screen_image(right_button.getAttribute('data-index'));
        });
    }

    let next_index = index_key + 1;
    if (index_key == last_index_key) { next_index = first_index_key; } // last element
    right_button.setAttribute('data-index', next_index);



    /// Images (one for view [main] and one for transitions [side])

    // Side image (for transitions efects)
    let img_side = document.querySelector('#full-screen-image img.side');
    if (!img_side) {

        img_side = document.createElement('img');
        img_side.classList.add('side');

        container.appendChild(img_side);
    }
    img_side.setAttribute('src', image.getAttribute('src'));

    // Main image
    let img_main = document.querySelector('#full-screen-image img.main');
    if (!img_main) {

        img_main = document.createElement('img');
        img_main.classList.add('main');
        container.appendChild(img_main);
    }

    // Check if an image is being displayed in main
    if (img_main.hasAttribute('src')) {

        img_main.classList.add('opacity_hide');

        setTimeout(() => {
            img_main.setAttribute('src', image.getAttribute('src'));
            img_main.classList.remove('opacity_hide');
        }, 180);

    } else {

        img_main.setAttribute('src', image.getAttribute('src'));
    }


    // Insert all on body
    if (!document.querySelector('#full-screen-image')) {
        document.body.appendChild(container);
    }


    // Show and adjust
    setTimeout(() => {
        container.classList.add('show');
        full_screen_image_positions_and_proportions();
    }, 10);



    /// Close all
    // When click on overlay
    overlay_image.addEventListener('click', function () {
        container.classList.add('opacity_hide');
        setTimeout(() => {
            container.remove();
        }, 300);
    });

    // When click on image
    img_main.addEventListener('click', function () {
        container.classList.add('opacity_hide');
        setTimeout(() => {
            container.remove();
        }, 300);
    });

}

/**
 * Set positions of next and preview full screen image
 */
function full_screen_image_positions_and_proportions() {

    let img_main = document.querySelector('#full-screen-image img.main');
    let img_side = document.querySelector('#full-screen-image img.side');

    setTimeout(() => {

        if (img_main) {
            // Full screen image proportions
            if ((img_main.width / img_main.height * window.innerHeight + 20) > window.innerWidth) {
                img_main.setAttribute('style', 'width: 87%;')
                img_side.setAttribute('style', 'width: 87%;')
            } else {
                img_main.setAttribute('style', 'height: 90%;')
                img_side.setAttribute('style', 'height: 90%;')
            }


            // Image buttons positions
            let position = img_main.getBoundingClientRect();

            let position_left = position.left + window.scrollX;
            let position_right = position.right;

            let left_button = document.querySelector('#full-screen-image button.left');
            let right_button = document.querySelector('#full-screen-image button.right');
            left_button.setAttribute('style', 'left: ' + (position_left - 25) + 'px; z-index:20;');
            right_button.setAttribute('style', 'right: ' + (position_right - img_main.offsetWidth - 25) + 'px; z-index:20;');
        }

    }, 10);
}


/**
 * Launch event on swype right
 */
function swype_right(node) {
    console.log(node);

    // product-gallery
    if (node.querySelector('.product-gallery button.left')) {
        node.querySelector('.product-gallery button.left').click();
    }

    // full screen image?
    let left_button = document.querySelector('#full-screen-image button.left');
    if (left_button) {
        full_screen_image(left_button.getAttribute('data-index'));
    }

}


/**
 * Launch event on swype left
 */
function swype_left(node) {
    console.log(node);

    // product-gallery
    if (node.querySelector('.product-gallery button.right')) {
        node.querySelector('.product-gallery button.right').click();
    }


    // full screen image?
    let right_button = document.querySelector('#full-screen-image button.right');
    if (right_button) {
        full_screen_image(right_button.getAttribute('data-index'));
    }

}



/**
 * Show or hide overlay layer
 */
function overlay(status) {
    if (status) {
        document.getElementById('overlay').classList.add('show');
    } else {
        document.getElementById('overlay').classList.remove('show');
    }
}


/**
 * Check swype gestures over node
 * return: left or right
 */
function check_swype(node) {
    console.log('check_swype');
    console.log(node);


    let start_x
    let end_x
    let treshold = 70; // minimum swipe distance to avoid noise

    node.addEventListener('touchstart', function (event) {
        start_x = event.touches[0].clientX;
        console.log('touchstart: ' + start_x);
    });

    node.addEventListener('touchend', function (event) {
        end_x = event.changedTouches[0].clientX;
        console.log('touchend: ' + end_x);

        //calculate the distance on x-axis and o y-axis. Check wheter had the great moving ratio.
        var x_distance = end_x - start_x;
        if (x_distance > 0) {
            // right direction
            if (start_x + treshold <= end_x) {
                swype_right(node);
            }
        } else {
            if (end_x + treshold <= start_x) {
                swype_left(node);
            }
        }
    });
}