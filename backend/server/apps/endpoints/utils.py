
import ast
import inspect

class AlgorithmLoader:
    machine_algorithm = None

    def __init__(self, file_path):
        self.file_path = file_path
        self.load_algorithm_code()

    def load_algorithm_code(self):
        with open(self.file_path, 'r') as file:
            AlgorithmLoader.machine_algorithm = file.read()
        self.create_class_from_file()

    def create_class_from_file(self):
        # Create a new class dynamically
        new_class = type('MachineAlgs', (object,), {})
        
        # Parse the file content to identify import statements and class definitions
        tree = ast.parse(AlgorithmLoader.machine_algorithm)
        import_statements = []
        class_name = None
        for node in ast.walk(tree):
            if isinstance(node, (ast.Import, ast.ImportFrom)):
                import_statements.append(node)
            elif isinstance(node, ast.ClassDef):
                class_name = node.name  # Get the class name dynamically
        
        # Create a local dictionary for executing the file content
        local_dict = {}
        
        # Execute the import statements in the local dictionary
        for node in import_statements:
            import_code = ast.unparse(node)
            exec(import_code, {}, local_dict)
        
        # Execute the rest of the file content in the local dictionary
        exec(AlgorithmLoader.machine_algorithm, local_dict, local_dict)
        
        # Extract the class from the local dictionary using the dynamically obtained class name
        extracted_class = local_dict.get(class_name)
        
        if extracted_class:
            # Iterate over the methods of the extracted class and add them to the new class
            for name, method in inspect.getmembers(extracted_class, predicate=inspect.isfunction):
                #print(f"Adding method {name} to MachineAlgs class")
                setattr(new_class, name, method)
        
        # Assign the new class to a class variable
        AlgorithmLoader.MachineAlgsClass = new_class

    def list_methods(self):
        # Parse the file content to identify function definitions
        tree = ast.parse(AlgorithmLoader.machine_algorithm)
        method_names = [node.name for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)]
        return method_names