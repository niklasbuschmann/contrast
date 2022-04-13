---
title: "Training"
permalink: "/training/"
layout: page
---

## <ins>Seminar</ins>
We organized our first image analysis seminar and a workshop on April 6th, 2022. 

![seminar announcement](/seminar_workkshop/Seminar_flyer.png)


Please click here to download <a href="/seminar_workkshop/Image analysis seminar_v10.pdf" download>Seminar Slides<a/>

## <ins>Workshop</ins>
In this workshop, we will work through following exercises:
1. Segmentation using global threshold, local threshold and Deep Learning (StarDist)
2. Cell tracking using StarDist and TrackMate
3. Denoising using Noise2Void
4. Bonus – 3D segmentation using StarDist and TrackMate

[Download images]() for the above exercises. 
  
  
### Getting appropriate plugins installed in your Fiji
We will be adding the following [updates sites](https://imagej.net/update-sites/following) in our Fiji to install all the required plugins for this workshop:   
  CSBDeep StarDist, TrackMate-StarDist  
  
Step 1: Start Fiji.  
Step 2: Select Help > Update... from the menu bar.  
Step 3: Click on the button "Manage update sites".  
Step 4: Scroll down the list and tick the checkboxes for update sites CSBDeep (shown below), StarDist and TrackMate-StarDist, then click the Close button.  
  
<p align="center">
          <img src="seminar_workkshop/CSBDeep_screenshot1.png" alt="CSBDeep update site" />
</p>

Step 5: Click on "Apply changes" to install the plugins.  
Step 6: Restart Fiji. StarDist plugin should now be available under Plugins > StarDist > StarDist 2D.  
  

### Exercise 1: Segmentation
[Download TIF file](seminar_workkshop/images/HT29_nuclei.tif)
#### Global segmentation  
Open above image by dragging into the Fiji window and run Threshold command: <code>Image > Adjust > Threshold...</code>  
Choose different thresholding methods (such as Default, Huang, Otsu etc.) from the drop down list and check how they perform on your image.  
Once satisfied with a particular method or by manually selecting the lower and upper bounds (sliders), click on Apply button to generate a thresholded image.  

All thresholding methods (such as Default, Huang, Otsu etc.) can be tested at once by using <code>Image > Adjust > Auto Threshold</code>  
  
#### Local segmentation  
Select your original image and run the command: <code>Image > Adjust > Auto Local Threshold</code>  
Run with "Try all" methods to check which one gives the best result. For this image, the best segmentation is achieved with the **Phansalkar** method  

#### Deep Learning based segmentation using [StarDist](https://imagej.net/plugins/stardist)  
Select your original image and run the command: <code>Plugins › StarDist › StarDist 2D</code>  
In the follow up menu, choose Model: Versatile (fluorescent nuclei) and click on the "Set optimized thresholds" tab at the bottom. Keep the other deafult options. Click on OK.  
A lable image will be genrated with the nuclei ROIs added to the ROI Manager.  
  
### Exercise 2: Tracking cancer cell migration  
[Download TIF file](seminar_workkshop/images/P31.tif)
  
  
  
  


