from extra_trees import ExtraTreesClassifier

et = ExtraTreesClassifier()
input_data = {
    "age": 37,
    "workclass": "Private",
    "fnlwgt": 34146,
    "education": "HS-grad",
    "education-num": 9,
    "marital-status": "Married-civ-spouse",
    "occupation": "Craft-repair",
    "relationship": "Husband",
    "race": "White",
    "sex": "Male",
    "capital-gain": 0,
    "capital-loss": 0,
    "hours-per-week": 68,
    "native-country": "United-States"
}
print(et.compute_prediction(input_data))