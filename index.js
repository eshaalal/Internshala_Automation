const puppeteer = require('puppeteer');
const coverLetterText = require('./cover'); // Adjust the path if necessary

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
        const profileName = ' Front End Development'; // Replace with the desired profile name
        const locationName = ''; // Leave empty if no location is provided
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
            await page.waitForSelector('#part_time', { visible: true });

            // Ensure the checkbox is not disabled
            const isDisabled = await page.$eval('#part_time', el => el.disabled);
            if (!isDisabled) {
                await page.click('#part_time');
                console.log('Part-time checkbox clicked.');
            } else {
                console.log('Part-time checkbox is disabled.');
            }
            await new Promise(resolve => setTimeout(resolve, 5000));
            console.log('Waited for 5 seconds.');
            // Verify the checkbox is checked
            const isChecked = await page.$eval('#part_time', el => el.checked);
            if (isChecked) {
                console.log('Part-time checkbox is now checked.');
            } else {
                console.log('Failed to check Part-time checkbox.');
            }
        }

        // Type the profile name into the search input
        await page.waitForSelector('input[value="e.g. Marketing"]', { visible: true });
        await page.type('input[value="e.g. Marketing"]', profileName, { delay: 100 });
        await page.keyboard.press('Enter');
        console.log(`Typed "${profileName}" into profile search input and pressed Enter.`);
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('Waited for 5 seconds.');

        // If a location is provided, type it and press Enter
        if (locationName) {
            await page.waitForSelector('input[value="e.g. Delhi"]', { visible: true });
            await page.type('input[value="e.g. Delhi"]', locationName, { delay: 100 });
            console.log(`Typed "${locationName}" into location search input.`);
            await page.keyboard.press('Enter');
            console.log('Enter key pressed for location.');
        }

        await new Promise(resolve => setTimeout(resolve, 5000));

        // Select internship containers
        await page.waitForSelector('div.individual_internship_details.individual_internship_internship', { visible: true });

        const internshipContainers = await page.$$('div.individual_internship_details.individual_internship_internship');

        if (internshipContainers.length === 0) {
            console.log('No internships found.');
        } else {
            const maxInternships = 5; // Maximum number of internships to apply to
            const internshipsToClick = internshipContainers.slice(0, Math.min(maxInternships, internshipContainers.length));
            for (let i = 0; i < internshipsToClick.length; i++) {
                await internshipsToClick[i].click();
                console.log(`Clicked on internship heading container ${i + 1}.`);

                // Optional: Add a manual wait time to handle slow content loading
                await new Promise(resolve => setTimeout(resolve, 10000));
                try {
                    await page.waitForSelector('button#continue_button.btn.btn-large', { visible: true, timeout: 60000 });
                    await page.click('button#continue_button.btn.btn-large');
                    console.log('Continue button clicked.');
                    await new Promise(resolve => setTimeout(resolve, 5000));

                } catch (error) {
                    console.error('Error clicking continue button:', error);
                }

                // Select the cover letter container
                await page.waitForSelector('#cover_letter_holder', { visible: true });
                await page.click('#cover_letter_holder', { clickCount: 3 }); // Select any existing text
                await page.type('#cover_letter_holder', coverLetterText, { delay: 10 });
                console.log('Typed cover letter into the cover letter container.');

                await new Promise(resolve => setTimeout(resolve, 5000));
                try {
                    await page.waitForSelector('#submit', { visible: true });
                    await page.click('#submit');
                    console.log('Submit button clicked.');
                } catch (error) {
                    console.error('Error clicking submit button:', error);
                }
                // Navigate back to the internships list if needed
                // await page.goBack();
                // console.log('Navigated back to internships list.');

                // // Wait for the internships page to reload
                // await page.waitForNavigation({ waitUntil: 'networkidle2' });
                try {
                    await page.waitForSelector('a#backToInternshipsCta', { visible: true });
                    await page.click('a#backToInternshipsCta');
                    console.log('Clicked on "Continue applying" button.');
                } catch (error) {
                    console.error('Error clicking "Continue applying" button:', error);
                }
                await new Promise(resolve => setTimeout(resolve, 5000));

            }
        }

        // Keep the browser open for further actions or debugging
        console.log('Browser is open. Press Ctrl+C to exit.');
        await new Promise(resolve => {});

    } catch (error) {
        console.error('Error:', error);
    }
})();
