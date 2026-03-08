document.addEventListener('DOMContentLoaded', function () {
    // This ensures the entire DOM is fully loaded before accessing elements.
    if(document.getElementById('enterTourButton') !== null)
    {
        var enterTourButton = document.getElementById("enterTourButton");
        enterTourButton.addEventListener("click", function () {
            document.getElementById("loadingScreen").style.display = "none";
            initBabylonScene();
        });
    }
});

function initBabylonScene() {

    var nodeData = window.nodeData;

    var canvas = document.getElementById("renderCanvas");
    var engine = new BABYLON.Engine(canvas, true);

    // Create scene and define initial camera parameters
    var scene = new BABYLON.Scene(engine);

    // Show the loading screen until everything is ready
    var loadingScreenDiv = document.getElementById("modelLoadingScreen");
    loadingScreenDiv.style.display = "flex";

    // Create a universal hemispheric light that should affect all objects equally
    var light = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    //external camera variables
    var initialAlphaExt = Math.PI / 3;
    var initialBetaExt = Math.PI / 2.2;
    var initialRadiusExt = 18;
    var initialTargetExt = new BABYLON.Vector3.Zero();

    //internal camera variables
    var initialAlphaInt = 2 * Math.PI / 4;
    var initialBetaInt = Math.PI / 2.2;
    var initialRadiusInt = 10;
    var initialTargetInt = new BABYLON.Vector3(1, 0, -11.5);


    var externalCamera = new BABYLON.ArcRotateCamera("externalCamera", initialAlphaExt, initialBetaExt, initialRadiusExt, initialTargetExt, scene);
    externalCamera.lowerRadiusLimit = 13; //how small you can zoom
    externalCamera.upperRadiusLimit = 18; //how far you can zoom
    externalCamera.lowerBetaLimit = 0.5; //how high is the vertical range of the camera (aim to not go through roof)
    externalCamera.upperBetaLimit = Math.PI / 2.2; //how low is the vertical range of the camera (aim to not go under flooring)
    externalCamera.lowerAlphaLimit = -Math.PI / 10; //min horiontal width of the camera (how far left)
    externalCamera.upperAlphaLimit = 1.2 * Math.PI; //max horiontal width of the camera (how far right)
    externalCamera.attachControl(canvas, true); // Do not attach control initially

    var interiorCamera = new BABYLON.ArcRotateCamera("interiorCamera", initialAlphaInt, initialBetaInt, initialRadiusInt, initialTargetInt, scene);
    interiorCamera.lowerRadiusLimit = 7.8; //how small you can zoom
    interiorCamera.upperRadiusLimit = 10; //how far you can zoom
    interiorCamera.lowerBetaLimit = 1; //how high is the vertical range of the camera (aim to not go through roof)
    interiorCamera.upperBetaLimit = Math.PI / 2.2; //how low is the vertical range of the camera (aim to not go under flooring)
    interiorCamera.lowerAlphaLimit = Math.PI / 2.6; //min horiontal width of the camera (how far left)
    interiorCamera.upperAlphaLimit = 2.1 * Math.PI / 4; //max horiontal width of the camera (how far right)
    //interiorCamera.lowerRadiusLimit = interiorCamera.upperRadiusLimit = 10; // Disable zoom for the interior camera
    interiorCamera.attachControl(canvas, false); // Do not attach control initially

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var nodeGroups = {
        "solarPanels": ["node41", "node102"],
        "outdoorlighting": ["node53", "node119"],
        "evcharger": ["node45", "node105"],
        "heatwaterPump": ["node49", "node2"],
        "windowcoverings": ["node75", "node63"],
        "lightfixtures": ["node67", "node122"],
        "airleakage": ["node83", "node135"],
        "thermostats": ["node71", "node57"],
        "kitchenappliances": ["node79", "node95", "node144", "node129"],
        "recyclablematerials": ["node91", "node87"]
    };

    var selectedNode = null; // Track the currently selected node
    var originalMaterials = new Map(); // To store original materials
    var guiLabel = null; // GUI label for the selected node

    // Add UI button to switch to external view
    var buttonExternal = BABYLON.GUI.Button.CreateSimpleButton("butExternal", "External View");
    buttonExternal.width = "150px";
    buttonExternal.height = "40px";
    buttonExternal.color = "white"; // Default text color
    buttonExternal.background = "black"; // Default background color
    buttonExternal.cornerRadius = 20;  // Set the corner radius for rounded edges
    buttonExternal.thickness = 0;      // Set the thickness of the border (optional)
    buttonExternal.top = "-10px";      // Adjust vertical position from the bottom
    buttonExternal.left = "-10px";     // Adjust horizontal position from the right
    buttonExternal.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    buttonExternal.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    buttonExternal.zIndex = 10; // Ensure it's on top
    buttonExternal.onPointerEnterObservable.add(function () {
        buttonExternal.background = "lightgrey"; // Change background to light grey when hovered
        buttonExternal.color = "black"; // Change text color to black when hovered
    });
    buttonExternal.onPointerOutObservable.add(function () {
        buttonExternal.background = "black"; // Change background back to black
        buttonExternal.color = "white"; // Change text color back to white
    });
    buttonExternal.onPointerUpObservable.add(function () {
        switchCamera(externalCamera);
        resetCameraToInitial(externalCamera, initialAlphaExt, initialBetaExt, initialRadiusExt, initialTargetExt);
    });
    advancedTexture.addControl(buttonExternal);

    // Add UI button to switch to interior view
    var buttonInterior = BABYLON.GUI.Button.CreateSimpleButton("butInterior", "Interior View");
    buttonInterior.width = "150px";
    buttonInterior.height = "40px";
    buttonInterior.color = "white"; // Default text color
    buttonInterior.background = "black"; // Default background color
    buttonInterior.cornerRadius = 20;  // Set the corner radius for rounded edges
    buttonInterior.thickness = 0;      // Set the thickness of the border (optional)
    buttonInterior.top = "-60px";      // Adjust vertical position so it doesn't overlap the external button
    buttonInterior.left = "-10px";     // Adjust horizontal position from the right
    buttonInterior.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    buttonInterior.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    buttonInterior.zIndex = 10; // Ensure it's on top
    buttonInterior.onPointerEnterObservable.add(function () {
        buttonInterior.background = "lightgrey"; // Change background to light grey when hovered
        buttonInterior.color = "black"; // Change text color to black when hovered
    });
    buttonInterior.onPointerOutObservable.add(function () {
        buttonInterior.background = "black"; // Change background back to black
        buttonInterior.color = "white"; // Change text color back to white
    });
    buttonInterior.onPointerUpObservable.add(function () {
        switchCamera(interiorCamera);
        resetCameraToInitial(interiorCamera, initialAlphaInt, initialBetaInt, initialRadiusInt, initialTargetInt);
    });
    advancedTexture.addControl(buttonInterior);

    // This set will store the names of clicked node groups
    var clickedGroups = new Set();

    // GUI label to display the count
    var countLabel = new BABYLON.GUI.TextBlock();
    countLabel.text = "0/10 components found";
    countLabel.color = "white";
    countLabel.fontSize = 24;
    countLabel.outlineWidth = 2;
    countLabel.outlineColor = "black";
    countLabel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    countLabel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    countLabel.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    countLabel.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    countLabel.paddingRight = "10px";
    countLabel.paddingTop = "10px";
    advancedTexture.addControl(countLabel);

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // Ensure the background is transparent
    scene.activeCamera = externalCamera; // Set external camera as the active camera initially

    var material = new BABYLON.StandardMaterial("backgroundMaterial", scene);
    material.diffuseColor = new BABYLON.Color3(1, 1, 1); // Ensure maximum brightness
    material.diffuseTexture = backgroundTexture;

    // Background texture
    var backgroundTexture = new BABYLON.Texture("https://Lareach.github.io/publicfiles/back1.jpg", scene);
    backgroundTexture.level = 2;
    var sizes = { width: 200, height: 500 };

    // Positions and rotations for each plane
    var positions = [
        { position: new BABYLON.Vector3(0, 150, -100), rotation: new BABYLON.Vector3(0, 0, 0) }, // Back
        { position: new BABYLON.Vector3(0, 150, 100), rotation: new BABYLON.Vector3(0, Math.PI, 0) }, // Front
        { position: new BABYLON.Vector3(-100, 150, 0), rotation: new BABYLON.Vector3(0, Math.PI / 2, 0) }, // Left
        { position: new BABYLON.Vector3(100, 150, 0), rotation: new BABYLON.Vector3(0, -Math.PI / 2, 0) }  // Right
    ];

    positions.forEach(function (pos) {
        var plane = BABYLON.MeshBuilder.CreatePlane("backgroundPlane", sizes, scene);
        plane.position = pos.position;
        plane.rotation = pos.rotation;
        var material = new BABYLON.StandardMaterial("backgroundMaterial", scene);
        material.diffuseTexture = backgroundTexture;
        material.backFaceCulling = false; // Ensure texture is visible from both sides
        plane.material = material;
        plane.isPickable = false; // Ensure the plane does not interfere with raycasting
    });

    // Function to handle camera switch
    function switchCamera(camera) {
        scene.activeCamera.detachControl(canvas);
        scene.activeCamera = camera;
        camera.attachControl(canvas, true);

        // Reinforce stopping the wheel event from scrolling the page
        canvas.addEventListener('wheel', function (event) {
            event.preventDefault();
        }, { passive: false });
    }

    // Function to reset camera to its initial position
    function resetCameraToInitial(camera, alpha, beta, radius, target) {
        scene.activeCamera.detachControl(canvas);
        camera.alpha = alpha;
        camera.beta = beta;
        camera.radius = radius;
        camera.setTarget(target);
        scene.activeCamera = camera;
        camera.attachControl(canvas, true);
    }

    function findGroupName(nodeName) {
        for (let key in nodeGroups) {
            if (nodeGroups[key].includes(nodeName)) {
                return key;
            }
        }
        return null; // Return null if no group is found
    }

    function applyInitialHighlight(node) {
        node.getChildMeshes().forEach(mesh => {
            if (!originalMaterials.has(mesh)) {
                originalMaterials.set(mesh, mesh.material); // Store original material
            }
            mesh.material = mesh.material.clone("clonedMaterial_" + mesh.name);
            mesh.material.emissiveColor = new BABYLON.Color3(0, 1, 0.333); // Always highlighted color
        });
    }
  
    function highlightNode(groupName) {
        var nodes = nodeGroups[groupName];
        if (nodes) {
            nodes.forEach(nodeName => {
                var node = scene.getTransformNodeByName(nodeName);
                if (node && !originalMaterials.has(node)) {
                    node.getChildMeshes().forEach(mesh => {
                        originalMaterials.set(mesh, mesh.material);
                        mesh.material = mesh.material.clone("clonedMaterial_" + mesh.name);

                        // Check if the node is one of the specified nodes and change color to orange
                        if (["node41", "node53", "node45", "node49", "node75", "node67", "node83", "node71", "node79", "node91"].includes(nodeName)) {
                            mesh.material.emissiveColor = new BABYLON.Color3(1, 1, 1); // Red
                        } else {
                            mesh.material.emissiveColor = new BABYLON.Color3(1, 0.5, 0); // Default color, adjust as necessary
                        }
                    });
                }
            });
        }
    }

    function resetNode(groupName) {
        var nodes = nodeGroups[groupName];
        if (nodes) {
            nodes.forEach(nodeName => {
                var node = scene.getTransformNodeByName(nodeName);
                if (node) {
                    node.getChildMeshes().forEach(mesh => {
                        if (originalMaterials.has(mesh)) {
                            mesh.material = originalMaterials.get(mesh);
                            originalMaterials.delete(mesh);
                        }
                    });
                }
            });
        }
        if (guiLabel) {
            guiLabel.dispose(); // Dispose the GUI label
            guiLabel = null;
        }
    }

    canvas.addEventListener('pointerdown', function (evt) {
        var pickResult = scene.pick(scene.pointerX, scene.pointerY);
        if (pickResult.hit) {
            var pickedNode = pickResult.pickedMesh.parent;
            if (pickedNode && pickedNode instanceof BABYLON.TransformNode) {
                var groupName = findGroupName(pickedNode.name);
                if (groupName) {
                    if (!clickedGroups.has(groupName)) {
                        clickedGroups.add(groupName);
                        // Update the counter in the GUI
                        countLabel.text = `${clickedGroups.size}/10 components found`;
                        if (clickedGroups.size === 10) {
                            countLabel.text += " - All components found!";
                        }
                    }
                    if (selectedNode && findGroupName(selectedNode.name) === groupName) {
                        return; // Do nothing if the same group is clicked again
                    }
                    if (selectedNode) {
                        resetNode(findGroupName(selectedNode.name));
                    }
                    highlightNode(groupName);
                    const data = nodeData[groupName];
                    // Reset the scrollTop to start from the top of the detailsContainer
                    document.getElementById("detailsContainer").scrollTop = 0;

                    document.getElementById("infoTitle").innerHTML = data.title;
                    document.getElementById("infoDescription").innerHTML = data.description;
                    selectedNode = pickedNode; // Update the selected node
                } else {
                    if (selectedNode) {
                        resetNode(findGroupName(selectedNode.name));
                        selectedNode = null;
                        if (guiLabel) {
                            guiLabel.dispose();
                            guiLabel = null;
                        }
                    }
                }
            }
        } else {
            if (selectedNode) {
                resetNode(findGroupName(selectedNode.name));
                selectedNode = null;
                if (guiLabel) {
                    guiLabel.dispose();
                    guiLabel = null;
                }
            }
        }
    });

    var alwaysHighlightedNodes = ["node41", "node53", "node45", "node49", "node75", "node67", "node83", "node71", "node79", "node91"];

    BABYLON.SceneLoader.ImportMesh("", "https://lareach.github.io/publicfiles/", "thehouse23.glb", scene, function (newMeshes, particleSystems, skeletons) {
        if (newMeshes.length > 0) {
            scene.activeCamera.target = newMeshes[0];
            newMeshes.forEach(mesh => {
                if (!mesh.parent) {
                    let transformNode = new BABYLON.TransformNode("Node_" + mesh.name, scene);
                    mesh.parent = transformNode;
                }
                // Apply initial highlighting to specified nodes
                if (alwaysHighlightedNodes.includes(mesh.parent.name)) {
                    applyInitialHighlight(mesh.parent);
                }
            });
        } else {
            console.error('No meshes were loaded. Check if the file path is correct and the model file is not corrupt.');
        }
        setTimeout(function () { loadingScreenDiv.style.display = "none"; }, 4000);
    });

    engine.runRenderLoop(function () {
        scene.render();
    });

    window.addEventListener('resize', function () {
        engine.resize();
    });
}
