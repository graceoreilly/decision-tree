// import { supabase } from './supabase';
// import { treeData } from '../../Data/treeType';

// const TREE_NAME = 'Main Decision Tree'; // Use a consistent name

// export const setupInitialData = async () => {
//   try {
//     // Check if our tree already exists
//     const { data: existingTree } = await supabase
//       .from('decision_trees')
//       .select('*')
//       .eq('name', TREE_NAME)
//       .maybeSingle();
    
//     if (existingTree) {
//       console.log('Tree already exists in database');
//       return existingTree;
//     }
    
//     // If tree doesn't exist, create it with our initial data
//     const { data, error } = await supabase
//       .from('decision_trees')
//       .insert([
//         {
//           name: TREE_NAME,
//           tree_data: treeData
//         }
//       ])
//       .select()
//       .single();
    
//     if (error) {
//       console.error('Error creating initial tree:', error);
//       throw error;
//     }
    
//     console.log('Created initial tree in database');
//     return data;
    
//   } catch (error) {
//     console.error('Setup error:', error);
//     throw error;
//   }
// };