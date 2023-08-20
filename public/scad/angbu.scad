latitude=37.49195;
$fn=60;
horizontal=0;

declination=-8.89144;

lineThickness = 0.13;

rightAscension = [-16.6, -11.7, -6.1, 0, 6.1, 11.7, 16.6, 22.3, 22.7, 23.5, 22.7, 20.3, 16.6, 11.7, 6.1, 0, -6.1, -11.7, -16.6, -20.3, -22.7, -23.5, -22.7, -20.3]; // 24절기
//항아리
module body(){
    difference(){
    union(){
        difference(){
            difference(){
                sphere(r=20);
                translate([-20,-20,0]){
                    cube(40);}
                }
            sphere(r=19);
            }
difference(){
    difference(){
    translate([0,0,-0.5]){
                cylinder(r=25, h=1);}
    translate([0,0,0]){
union(){
rotate([0,0,180]){
    linear_extrude(1){
    text("        N",    direction="ttb", size=2); 
    }
}
    text("        S",direction="ttb",size=2); 
}    
    }
                }    
sphere(r=19);
            }
    }
translate([-lineThickness/2,-20,0]){
    cube([lineThickness,40,1]);}
}   
}
//다리
module legs() {
    union(){translate([0,22.7,-24]){cylinder(24,0.8,2.3,$fn=60);}
translate([-sqrt(386.4765),-11.35,-24]){cylinder(24,0.8,2.3,$fn=60);}
translate([sqrt(386.4765),-11.35,-24]){cylinder(24,0.8,2.3,$fn=60);}
    
}}

//영침
module angle()
{
    rotate(a=90+latitude,v=[1,0,0]){
        translate([0,0,0]){
            cylinder(19,0.2,2);
            }
    }   
}

//시간선
module time(m)
{
    //color([1,0,0])
    {
        rotate(latitude,v=[1,0,0]){
            rotate([0,m,0]){
                    cylinder(h =lineThickness,r = 19.5);
            }
        }
    }
}

//절기선
module season()
{
    difference() {
        //difference() {
        for (i = [0:1:23]) {
            //color([1,0,1])
            {
                // rightAscension[i] 적위위
                // 18.8 안 쪽 반지름
                //echo(19*sin(rightAscension[i])*cos(latitude));
                translate([0,19*sin(rightAscension[i])*cos(latitude),19*sin(rightAscension[i])*sin(latitude)])
                {
                    rotate(90-latitude,v=[-1,0,0]){                                cylinder(h = lineThickness,r = 19.5*cos(rightAscension[i]));

                    }
                }
            }
        };
        //sphere(19);
    //}
        // 불필요한 절기선 자르기
        translate([-20,-20,0])
        {cube(40);}
    }
}

//1시간
module hour(){
    difference() {
    union(){
        for (i = [0:15:180]){
         time(i);   
        }
    }
    translate([-20,-20,0]){
            cube(40);}
}
}

//15분
module minute(){
    difference(){
        difference(){
            union(){
                for (i = [0:15/4:180]) {
                    time(i);  
                    }
            }
           union(){
            rotate(a=90+latitude,v=[1,0,0]){ 
cylinder(20,17.5,17.5);}
        rotate(a=90-latitude,v=[-1,0,0]){ 
cylinder(20,17.5,17.5);}}
        }
        {
            translate([-20,-20,0]){
            cube(40);}
        }
    }   
 }
 
 //지평환 선
module dec(){
rotate([0,0,-declination]){
    translate([-lineThickness/2,-25,-0.2]){
    cube([lineThickness,50,1]);}
    }
}
 
angle();
legs();
difference(){
    body();
     union() {
         dec();
         season();
         hour();
         minute();
     }
}
//hour();
//minute();
