<?php include 'connect.php'; ?>
<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Google Tag Manager -->
    <script>
    //     function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");
    // o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,
    // o.onload=function(){window.trackingFunctions.onLoad({appId:"69d3cb69612e75001d95a99b"})},
    // document.head.appendChild(o)}initApollo();
    </script>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-KK6TG48P');</script>
<!-- End Google Tag Manager -->
    <meta charset="utf-8">
    
    <meta name="google-site-verification" content="bYbf1N2htDI4WLRqqz2q7kf-_y2xr3stoRQQOv0-Ooc" />

    <!-- Page Title -->
    <title>TheBoredMonkey</title>
    <!--/ Page Title -->
 <!-- Apollo widget begin -->
  
    <script
      type="text/javascript"
      src="https://assets.apollo.io/js/meetings/meetings-widget.js"
      onload='window.ApolloMeetings.initWidget({appId: "69d3cb69612e75001d95a99b", schedulingLink: "4z6-bqg-il0"})'
      defer
    ></script>
  <!-- Apollo widget end -->
   
    <meta name="description" content="TheBoredMonkey is a creative influencer marketing agency based in Mumbai who connects brands with the audience through unique creations and effective communication.">
    <meta name="keywords" content="theboredmonkey, the bored monkey, influencers, marketing, digital marketing, brands, connects, connect">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta property="og:image"  itemprop="image" content="https://theboredmonkey.com/images/banner.png?version=767576576" />
    
    
    <meta property="og:image:secure_url" content="https://theboredmonkey.com/images/banner.png?version=345345" /> 
    <meta property="og:image:type" content="https://theboredmonkey.com/images/banner.png?version=34353464545" />


    <meta property="og:url" content="https://theboredmonkey.com/">
	<meta property="og:type" content="website">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <link id="icon" rel="icon" href="./images/team/title-logo1.png" type="image/icon type">
   
  
    <link href="css/plugins.css" rel="stylesheet">
    <link href="style.css?version=<?php echo time(); ?>" rel="stylesheet">
    <link href="css/master.css?version=<?php echo time(); ?>" rel="stylesheet">
    <link href="css/newtest.css?version=<?php echo time(); ?>" rel="stylesheet">
   <?php  if($page!=undefined && $page =='index'){ ?>
    <link href="css/newmaster.css?version=<?php echo time(); ?>" rel="stylesheet">
     <?php  } ?>
    


    <!-- Favicons -->
    <link rel="shortcut icon" href="img/favicon.png" />
    <link rel="apple-touch-icon" href="img/favicon.png" />
    <!--/ Favicons -->
</head>

<body data-barba="wrapper"  data-cursor="true" data-header-sticky="true" data-menu-style="overlay" data-page-layout="light" data-header-layout="dark" data-menu-layout="light" data-footer-layout="light" data-page-loader="true">
    <!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KK6TG48P"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->

    <!--Page Loader-->
    <!--<div data-duration="5" class="alioth-page-loader" data-layout="light">-->
        
    <!--    <span class="apl-background"></span>-->
        

        <!--Loader Percentage (Don't Touch)-->
    <!--    <div class="apl-count"></div>-->
        <!--Loader Percentage (Don't Touch)-->

    <!--</div>-->
    <div data-duration="2" class="alioth-page-loader" data-layout="light">

        <span class="apl-background"></span>
<div  class="apl-count1" 
    >
          <?
            $sql = "SELECT * FROM qoutes ORDER BY RAND() LIMIT 1";
            $result = $link->query($sql);

            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $author=$row['name'];
                    echo $row["qoutes"]  ;
                    echo "<br>";
                    if($author!=""){
                    echo "—" . $author ;
                    }else{
                         echo $author ;
                    }
                }
                
            } 
        ?>  
   
    </div>
        <!--Loader Percentage (Don't Touch)-->
        <div class="apl-count"></div>
        <!--Loader Percentage (Don't Touch)-->

    </div>
    
    
    
    
    
    <!--/Page Loader-->

    <!--Page Transitions-->
    <div class="alioth-page-transitions" data-layout="light">
        
     

        <!--Transition Background (Don't touch)-->
        <span class="apt-bg"></span>
        
        <!--/Transition Background (Don't touch)-->

        <!--Transition Text-->
        <div class="trans-text">Loading, please wait..</div>
        <!--Transition Text-->

    </div>
    <!--/Page Transitions-->
    

    <!-- Mouse Cursor -->
    <div data-dark-circle="rgba(25,27,29,.6)" data-dark-dot="#191b1d" data-light-circle="hsla(0,0%,100%,.2)" data-light-dot="#fff" id="mouseCursor">
        <div id="cursor"></div>
        <div id="dot"></div>
    </div>
    <!-- /Mouse Cursor -->

    <!-- Header -->
    <div class="site-header">

        <div class="header-wrapper">

            <!-- Site Branding -->
            <div class="site-branding">

                <!-- Site Logos -->
                <div class="site-logo">
                    <a href="index.php">
                        <?php if($page=="white"){ ?>
                        <div class="dark-logo logoheader1"></div>
                         <?php }else{ ?>
                            <div class="dark-logo logoheader"></div>
                           <?php } ?>
                        <!--<img alt="Site Logo" class="dark-logo" src="images/logo.png">-->
                        
                         <?php if($page=="white"){ ?>
                        <div class="light-logo logoheader1"></div>
                         <?php }else{ ?>
                            <div class="light-logo logoheader"></div>
                           <?php } ?>
                        <!--<img alt="Site Logo Light" class="light-logo" src="img/site-logo-light.png">-->
                        
          
                        
                        
                        
                        
                        
                        
                        
                    </a>
                    
                </div>
                <!-- /Site Logos -->

            </div>
            <!-- /Site Branding -->

            <!-- Menu Toggle Button (Don't touch) -->
            <div class="menu-toggle">
                <span class="toggle-line"></span>
                <span class="toggle-line"></span>
            </div>
            <!-- /Menu Toggle Button (Don't touch) -->

            <!-- Site Navigation -->
            <div class="site-navigation">

                <span class="sub-back"><i class="icofont-long-arrow-left"></i></span>
                
                
               
                

                <!-- Main Menu -->
                <ul class="menu main-menu">
                 <li class="menu-item"><a href="./index.php">Home</a></li>
                 <li class="menu-item"><a href="https://www.theboredmonkey.com/studio">Studio</a></li>
                 <li class="menu-item"><a href="./about.php">About Us</a></li>
                 <!--<li class="menu-item"><a href="our-team.php">Team</a></li>-->
                 <!--<li class="menu-item"><a href="client.php">Clients</a></li>-->
                 <li class="menu-item"><a href="./our-services.php">Services</a></li>
                
                <!--<li class="menu-item"><a href="./work.php">Portfolio</a></li>-->
                <!--<li class="menu-item"><a href="blog.php">Blog</a></li>-->
                <li class="menu-item"><a href="./contact.php">Contact
                </a></li>

            </ul>
            <!-- /Main Menu -->

            <!-- Menu Widget (Left) -->
            <div class="menu-widget menu-widget-left">
                <ul class="social-list">
                        <li><a target="_blank" href="https://www.instagram.com/theboredmonkeyofficial/?hl=en">Instagram</a></li>
                        <li><a target="_blank" href="https://www.linkedin.com/company/theboredmonkey/">LinkedIn</a></li>
                        <li><a target="_blank" href="https://twitter.com/TheBoredMonkey1">Twitter</a></li>
                        <li><a target="_blank" href="https://www.facebook.com/theboredmonkey101">Facebook</a></li>
                </ul>

            </div>
            <!-- /Menu Widget (Left) -->

            <!-- Menu Widget (Right) -->
            <!--<div class="menu-widget menu-widget-right">-->
            <!--    <div class="git-button">-->
            <!--        <a href="mailto:hello@pethemes.com">Get in touch!</a>-->
            <!--    </div>-->
            <!--</div>-->
            <!-- /Menu Widget (Right) -->

        </div>
        <!-- /Site Navigation -->

        <!-- Header Widgets -->
        <div class="header-widgets">

            <!-- Header Widget-->
            <div class="header-widget">

                <!--CTA Widget-->
                 <div class="header-cta-but">
                    <a data-hover="Book a Call" href="#qualify">
                        Book a Call
                    </a>
                </div>
                <!--CTA Widget-->

            </div>
            <!-- Header Widget-->
        </div>
        <!-- /Header Widgets -->

    </div>

</div>
<!-- /Header -->
