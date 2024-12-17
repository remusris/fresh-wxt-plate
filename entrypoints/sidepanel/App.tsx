    import { ForceGraph2D, ForceGraph3D, ForceGraphVR, ForceGraphAR } from 'react-force-graph';

    const graphData = {
        nodes: [ 
            { 
            id: "id1",
            name: "name1",
            val: 1 
            },
            { 
            id: "id2",
            name: "name2",
            val: 10 
            },
            
        ],
        links: [
            {
                source: "id1",
                target: "id2"
            }
        ]
    }


    const App = () => {
        return (
            <div className="h-full w-full">
                <ForceGraph2D 
                    graphData={graphData}
                    nodeCanvasObject={(node, ctx, globalScale) => {
                        const label = node.name;
                        const fontSize = 12/globalScale;
                        ctx.font = `${fontSize}px Sans-Serif`;
                        
                        // Draw node circle
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
                        ctx.fillStyle = '#4CAF50';
                        ctx.fill();
                        
                        // Draw text label
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'black';
                        ctx.fillText(label, node.x, node.y + 10);
                    }}
                />
            </div>
        )
    }

    export default App;