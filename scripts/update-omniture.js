function updateOmniture(id){
            if(id == "undefined" || id == null)id=0;
            
            // s == omniture object
            if(s){
            
               // make sure we have the page name defined
                        if(this_page_title != "undefined" ){
				
                                    // rebuild the omniture parameters
                                    s.pageName = window.niceromn.pageName;
                                    s.server = "www.baltimoresun.com";
                                    s.channel = "Baltimore Sun:news:maryland";
                                    s.prop38 = window.niceromn.prop38;
                                    s.eVar21 = window.niceromn.eVar21;
                                    
                                    // update this one to reflect the new image, in the same style as initial parameter
                                    omni_new_slug = "gal"+id;
            
                                    s.prop31 = this_page_title;
						s.prop37 = this_page_title;
									
                                    // rebuild E-commerce Variables 
                                    s.hier1="Baltimore Sun:news:maryland"; 
                                    s.hier2="news:maryland";
                                    s.hier4="news:maryland";
                 
					//temporary.
					 /*console.log('omn.updated for #'+omid);*/
 
                                    // send it on it's way
                                    void(s.t());

                        }
            }
} 