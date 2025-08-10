<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Karma - the Game of Destiny</title>

		<style>
			body
			{
			background-color:#cbdfee;
			}
		</style>
        
        <link href="css/journeybook_styles.css" rel="stylesheet" type="text/css" media="screen">
        
        <script type="text/javascript" src="js/time_view.js"></script>		
			<script type="text/javascript" src="js/date_time.js"></script>
            
            <style>
			body
			{
			background-color:#cbdfee;
			}
			</style>
			
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
	
<body onLoad="date_time(); startTime();" >
            
</head>

<body>

<?php
		$IP = $_SERVER["REMOTE_ADDR"];
		$file = "karmalog.txt";
		$txtfile = fopen($file, "a");
		$stamp = date('Y-m-d H:i:s');
		$page = "journrybook.php";
		fwrite($txtfile, "\r\n");
		fwrite($txtfile, $IP);
		fwrite($txtfile, "\t");
		fwrite($txtfile, $stamp);
		fwrite($txtfile, "\t");
		fwrite($txtfile, $page);
		
		fclose($txtfile);
		?>
        
        <span id="date_time"></span>
            <script type="text/javascript">window.onload = date_time('date_time'); </script>

		
		<!-- Top of Page - Time, Date, Main Title, Small Map -->
		
		<div id="top">
			
			<div id="topbar">
				
			<div id="time-date">
				
				<div id="clock">
					<div id="txt"></div>	
				</div>
					
				<div id="day">	
					<div id="id"></div>
            	</div>	
				
			</div>		
				
				<div id="main_title">Karma</div>
                
                <div id="subtitle">the Game of Destiny</div>
			</div>
		
		
		</div>
		
		<br>
		
		<!-- Headline of Page - Titles of sections and lines -->

		<div id="top_line"></div> <br>
<div id="headline_titles">
        
 
		
	</div>
   
    <div id="pad_wrapper">
        
        
      <div id="pad">
        
        <h1>My Journey Book</h1>
        <br>
        <div id="mbook">
       
        	
            
            <div id="left_column" class="left_column">
            
            <div id="questions">
            <h1>HOBBIES</h1>
            <br>
            <p>Painting</p>
            
            
            
            <form>
                <input type="radio" name="choice" id="choice" value="guru"/><label>Guru</label><br>
                <input type="radio" name="choice" id="choice" value="expert"/><label>Expert</label><br>
                <input type="radio" name="choice" id="choice" value="advanced"/><label>Advanced</label><br>
                <input type="radio" name="choice" id="choice" value="intermediate"/><label>Intermediate</label><br>
                <input type="radio" name="choice" id="choice" value="beginner"/><label>Beginner</label><br>
                <input type="radio" name="choice" id="choice" value="want_to_try"/><label>Want to Try</label><br>
            </form> 
            <br>
            <p>Photography</p>
           
            
            
            <form>
                <input type="radio" name="choice" id="choice" value="guru"/><label>Guru</label><br>
                <input type="radio" name="choice" id="choice" value="expert"/><label>Expert</label><br>
                <input type="radio" name="choice" id="choice" value="advanced"/><label>Advanced</label><br>
                <input type="radio" name="choice" id="choice" value="intermediate"/><label>Intermediate</label><br>
                <input type="radio" name="choice" id="choice" value="beginner"/><label>Beginner</label><br>
                <input type="radio" name="choice" id="choice" value="want_to_try"/><label>Want to Try</label><br>
            </form> 
            </div>  <!-- end #questions -->
            </div>  <!-- end #left_column -->
            
            
            
            
            <div id="center_column" class="center_column">
                <div id="space">
                    <div id="white_block" class"white_block"></div>  <!-- end #white_block -->
                    <div id="dark_center" class"dark_center"></div>  <!-- end #dark_center -->
                    <div id="white_block" class"white_block"></div>  <!-- end #white_block -->
                </div>  <!-- end #space -->
                
                <div id="binder">
                    <div id="dark_space" class"dark_space">
                    <div id="dark_bar" class"dark_bar"></div>  <!-- end #dark_bar -->
                    <div id="white_space" class"white_space"></div>  <!-- end #white_space -->
                </div>  <!-- end #dark_space -->
                </div>  <!-- end #binder -->
                
                <div id="space">
                    <div id="white_block" class"white_block"></div>  <!-- end #white_block -->
                    <div id="dark_center" class"dark_center"></div>  <!-- end #dark_center -->
                    <div id="white_block" class"white_block"></div>  <!-- end #white_block -->
                </div>  <!-- end #space -->
                
                <div id="binder">
                    <div id="dark_space" class"dark_space">
                    <div id="dark_bar" class"dark_bar"></div>  <!-- end #dark_bar -->
                    <div id="white_space" class"white_space"></div>  <!-- end #white_space -->
                </div>  <!-- end #dark_space -->
                </div>  <!-- end #binder -->
                
                <div id="space">
                    <div id="white_block" class"white_block"></div>  <!-- end #white_block -->
                    <div id="dark_center" class"dark_center"></div>  <!-- end #dark_center -->
                    <div id="white_block" class"white_block"></div>  <!-- end #white_block -->
                </div>  <!-- end #space -->
                
                <div id="binder">
                    <div id="dark_space" class"dark_space">
                    <div id="dark_bar" class"dark_bar"></div>  <!-- end #dark_bar -->
                    <div id="white_space" class"white_space"></div>  <!-- end #white_space -->
                </div>  <!-- end #dark_space -->
                </div>  <!-- end #binder -->
                
                <div id="space">
                    <div id="white_block" class"white_block"></div>  <!-- end #white_block -->
                    <div id="dark_center" class"dark_center"></div>  <!-- end #dark_center -->
                    <div id="white_block" class"white_block"></div>  <!-- end #white_block -->
                </div>  <!-- end #space -->
                
            
            </div>  <!-- end #center_column -->
            
            
            
        
        	<div id="right_column" class="right_column">
            
               <div id="questions">
            <h1>HOBBIES</h1>
            <br>
            <p>Pottery</p>
            
            
            
            <form>
                <input type="radio" name="choice" id="choice" value="guru"/><label>Guru</label><br>
                <input type="radio" name="choice" id="choice" value="expert"/><label>Expert</label><br>
                <input type="radio" name="choice" id="choice" value="advanced"/><label>Advanced</label><br>
                <input type="radio" name="choice" id="choice" value="intermediate"/><label>Intermediate</label><br>
                <input type="radio" name="choice" id="choice" value="beginner"/><label>Beginner</label><br>
                <input type="radio" name="choice" id="choice" value="want_to_try"/><label>Want to Try</label><br>
            </form> 
            <br>
            <p>Sculpting</p>
           
            
            
            <form>
                <input type="radio" name="choice" id="choice" value="guru"/><label>Guru</label><br>
                <input type="radio" name="choice" id="choice" value="expert"/><label>Expert</label><br>
                <input type="radio" name="choice" id="choice" value="advanced"/><label>Advanced</label><br>
                <input type="radio" name="choice" id="choice" value="intermediate"/><label>Intermediate</label><br>
                <input type="radio" name="choice" id="choice" value="beginner"/><label>Beginner</label><br>
                <input type="radio" name="choice" id="choice" value="want_to_try"/><label>Want to Try</label><br>
            </form> 
            </div>  <!-- end #questions -->
            
            </div>  <!-- end #right_column -->
            
            
            
            
        	<div id="tab_column" class="tab_column">
              <div id="tabs">
                    <div id="tab_dark_space" class="close_button"><a href="main.php">X</a></div>  <!-- end #tab_dark_space -->
                    <div id="tab_blue"></div>  <!-- end #tab_dark_space -->
                    <div id="tab_dark_space"></div>  <!-- end #tab_dark_space -->
                    <div id="tab_yellow"></div>  <!-- end #tab_dark_space -->
                    <div id="tab_dark_space"></div>  <!-- end #tab_dark_space -->
                    <div id="tab_red"></div>  <!-- end #tab_dark_space -->
                    <div id="tab_dark_space"></div>  <!-- end #tab_dark_space -->
              </div>  <!-- end #tabs -->
            </div>  <!-- end #tab_column -->

            
        </div>  <!-- end #book -->
        	
        
        
    </div>  <!-- end of #pad -->

        </div>  <!-- end of #pad_wrapper -->
        
        
        



</body>
</html>