import simpleGit from 'simple-git';

// Create a Git instance
const git = simpleGit();


// Function to checkout a branch by its unique ID
const checkoutBranchById = async (id: string): Promise<void> => {
    try {
        // Get all branches
        const branches = await git.branch();

        // Find the branch with the given ID
        const branch = branches.all.find((branchName: string) => branchName.startsWith(`${id}.`));

        if (!branch) {
            console.log(`Branch with ID ${id} not found.`);
            console.log('Available branches:');
            branches.all.forEach((branchName: string) => {
                if (!branchName.startsWith('remotes/')) { 
                    console.log(branchName);
                }
            });
            return;
        }

        // Checkout the found branch
        const response = await git.checkout(branch);
        console.log(`Switched to branch: ${branch}`);
        console.log('Checkout response:', await response);
    } catch (error) {
        console.error('Error while checking out branch:', error);
    }
};

// Get the branch ID from command line arguments
const branchId: string | undefined = process.argv[2];

if (!branchId) {
    console.log('Please provide a branch ID.');
} else {
    checkoutBranchById(branchId);
}
