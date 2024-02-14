import axios, { AxiosResponse } from 'axios';
import { CLEAN_DLC, UPDATE_ON_LAUNCH } from './config/configs';

async function updateTranslations(): Promise<void> {
    try {
        // Make API request to update translations
        const response: AxiosResponse<string> = await axios.post('https://example.com/update-translations');
        console.log('Translations updated successfully:', response.data);
    } catch (error: any) {
        console.error('Error updating translations:', error.message);
        process.exit(1); // Exit with error status
    }
}

async function cleanDLC(): Promise<void> {
    if (CLEAN_DLC) {
        console.log('Cleaning DLC...');
        // Perform cleaning of DLC
        console.log('DLC cleaned successfully.');
    }
}

function main() {
    if (UPDATE_ON_LAUNCH) {
        updateTranslations();
    }

    cleanDLC();
}

main()