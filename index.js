const puppeteer = require('puppeteer');

(async () => {
    try {
        // Launch the browser
        const browser = await puppeteer.launch({
            headless: false, // Set to true if you don't want the browser to be visible
            defaultViewport: null,
            args: ['--start-maximized']
        });

        // Open a new page
        const page = await browser.newPage();

        // Go to Internshala
        await page.goto('https://internshala.com/', { waitUntil: 'networkidle2' });

        // Wait for the login button to be visible
        await page.waitForSelector('button[data-toggle="modal"][data-target="#login-modal"].login-cta', { visible: true });

        // Click the login button
        await page.click('button[data-toggle="modal"][data-target="#login-modal"].login-cta');
        console.log('Login button clicked!');

        // Wait for the login modal to appear
        await page.waitForSelector('#login-modal', { visible: true });

        // Fill out the email field
        await page.waitForSelector('#modal_email', { visible: true });
        await page.type('#modal_email', 'eshalal9693@gmail.com', { delay: 100 }); // Added typing delay

        // Fill out the password field
        await page.waitForSelector('#modal_password', { visible: true });
        await page.type('#modal_password', '#esha2127E', { delay: 100 }); // Added typing delay

        console.log('Email and password entered.');

        // Click the login button inside the modal
        await page.waitForSelector('button#modal_login_submit', { visible: true });
        await page.click('button#modal_login_submit');

        console.log('Login button inside modal clicked.');

        // Wait for navigation or the next step if applicable
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log('Navigation completed.');
        await page.waitForSelector('a.nav-link.dropdown-toggle.internship_link', { visible: true });
        await page.click('a.nav-link.dropdown-toggle.internship_link');

        console.log('Internships link clicked.');

        // Optionally, wait for the new page to load or handle further actions
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        console.log('Navigation to Internships page completed.');

        // Profile and location names
        const profileName = ' Web Development'; // Replace with the desired profile name
        const locationName = ' Delhi'; // Leave empty if no location is provided
        const chooseToWorkFromHome = true;
        const choosePartTimeWork = false;

        // Check the Work from Home checkbox first
        if (chooseToWorkFromHome) {
            await page.waitForSelector('#work_from_home', { visible: true });

            // Ensure the checkbox is not disabled
            const isDisabled = await page.$eval('#work_from_home', el => el.disabled);
            if (!isDisabled) {
                await page.click('#work_from_home');
                console.log('Work from Home checkbox clicked.');
            } else {
                console.log('Work from Home checkbox is disabled.');
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.log('Waited for 5 seconds.');
            // Verify the checkbox is checked
            const isChecked = await page.$eval('#work_from_home', el => el.checked);
            if (isChecked) {
                console.log('Work from Home checkbox is now checked.');
            } else {
                console.log('Failed to check Work from Home checkbox.');
            }
            
        }
        
        if (choosePartTimeWork) {
                await page.waitForSelector('#work_from_home', { visible: true });
    
                // Ensure the checkbox is not disabled
                const isDisabled = await page.$eval('#work_from_home', el => el.disabled);
                if (!isDisabled) {
                    await page.click('#part_time');
                    console.log('Work from Home checkbox clicked.');
                } else {
                    console.log('Work from Home checkbox is disabled.');
                }
                await new Promise(resolve => setTimeout(resolve, 5000));
                console.log('Waited for 5 seconds.');
                // Verify the checkbox is checked
                const isChecked = await page.$eval('#part_time', el => el.checked);
                if (isChecked) {
                    console.log('Work from Home checkbox is now checked.');
                } else {
                    console.log('Failed to check Work from Home checkbox.');
                }
                
            }

        // Type the profile name into the search input
        await page.waitForSelector('input[value="e.g. Marketing"]', { visible: true });
        await page.type('input[value="e.g. Marketing"]', profileName, { delay: 100 });
        await page.keyboard.press('Enter');
        console.log(`Typed "${profileName}" into profile search input and pressed Enter.`);
        await new Promise(resolve => setTimeout(resolve, 5000));
            console.log('Waited for 10 seconds.');
        
        // Wait for any potential updates or changes to the page after saving the input
        //await page.waitForNavigation({ waitUntil: 'networkidle2' });

        // If a location is provided, type it and press Enter
        if (locationName) {
            await page.waitForSelector('input[value="e.g. Delhi"]', { visible: true });
            await page.type('input[value="e.g. Delhi"]', locationName, { delay: 100 });
            console.log(`Typed "${locationName}" into location search input.`);
            await page.keyboard.press('Enter');
            console.log('Enter key pressed for location.');
        }
        
        
        // Keep the browser open for further actions or debugging
        console.log('Browser is open. Press Ctrl+C to exit.');
        await new Promise(resolve => {});

    } catch (error) {
        console.error('Error:', error);
    }
})();
