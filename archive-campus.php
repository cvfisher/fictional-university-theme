<?php 
  get_header(); 
  pageBanner(title: 'Our Campuses', subtitle: 'We have several convieniently located campuses.')
  ?>


    <div class="container container--narrow page-section">
    <div class="acf-map">
    <?php 
      while(have_posts()) {
        the_post(); 
        $mapLocation = get_field('map_location');
        ?>
       <div class="marker" data-lat="<?= $mapLocation['lat'] ?>" data-lng="<?= $mapLocation['lng'] ?>">
      <h3><a href="<?php the_permalink() ?>"><?php the_title(); ?></a></h3>
      <?= $mapLocation['address']; ?>
      </div>
        <?php } ?>
    </div>
    </div>
<?php  
get_footer();
