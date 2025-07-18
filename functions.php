<?php

require get_theme_file_path('/inc/search-route.php');

function university_custom_rest() {
    register_rest_field('post', 'authorName', array(
        'get_callback' => function() {return get_the_author();}
    ));
    }

add_action('rest_api_init', 'university_custom_rest');

function pageBanner($title = '', $subtitle = '', $photoUrl = '') {
    $newTitle = $title;
    $newSubtitle = $subtitle;
    $newPhotoUrl = $photoUrl;
    if (empty($newTitle)) {
        $newTitle = get_the_title();
    }

    if (empty($newSubtitle)) {
        $newSubtitle = get_field('page_banner_subtitle');
    }

    if (empty($newPhotoUrl)) {
        $image = get_field('page_banner_background_image');
    
        if ($image && isset($image['sizes']['pageBanner']) && !is_archive() && !is_home()) {
            $newPhotoUrl = $image['sizes']['pageBanner'];
        } else {
            $newPhotoUrl = get_theme_file_uri('/images/ocean.jpg');
        }
    }
    ?>
    <div class="page-banner">
      <div class="page-banner__bg-image" style="background-image: url(<?= $newPhotoUrl ?>)"></div>
      <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?= $newTitle ?></h1>
        <div class="page-banner__intro">
          <p><?= $newSubtitle ?></p>
        </div>
      </div>
    </div>
<?php
}

function university_files() {
    wp_enqueue_script('googleMap', '//maps.googleapis.com/maps/api/js?key=AIzaSyCtUPKzdz8xa1AiRqmTR5fSbQp8onM1mDY', NULL, '1.0', true);
    wp_enqueue_script('main-university-js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.0', true);
    wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
    wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));
    wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
    wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');

    wp_localize_script('main-university-js', 'universityData', array(
        'root_url' => get_site_url()
    ));
}

add_action('wp_enqueue_scripts', 'university_files');

function universityMapKey($api) {
    $api['key'] = 'AIzaSyCtUPKzdz8xa1AiRqmTR5fSbQp8onM1mDY';
    return $api;
}

add_filter('acf/fields/google_map/api', 'universityMapKey');

function university_features() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_image_size('professorLandscape', 400, 260, true);
    add_image_size('professorPortrait', 480, 650, true);
    add_image_size('pageBanner', 1500, 350, true);
}

add_action('after_setup_theme', 'university_features');

function university_adjust_queries($query) {
    if (!is_admin() AND is_post_type_archive('campus') AND is_main_query()) {
        $query->set('posts_per_page', -1);
    }
    
    if (!is_admin() AND is_post_type_archive('program') AND is_main_query()) {
        $query->set('orderby', 'title');
        $query->set('order', 'ASC');
        $query->set('posts_per_page', -1);
    }

    if (!is_admin() AND is_post_type_archive('event') AND $query->is_main_query()) {
        $today = date('Ymd');
        $query->set('meta_key', 'event_date');
        $query->set('orderby', 'meta_value_num');
        $query->set('order', 'ASC');
        $query->set('meta_query', array(
            array(
              'key' => 'event_date', 
              'compare' => '>=', 
              'value' => $today,
              'type' => 'numeric'
            )
          ));
    }
};

add_action('pre_get_posts', 'university_adjust_queries');