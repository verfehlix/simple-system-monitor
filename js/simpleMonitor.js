//define charts
var desktopMemChart;
var desktopCpuChart;

//do first request for charts
var doInitialRequests = function() {
    //desktop
    $.ajax({
        url: "http://localhost:8899",
        contentType: "application/json",
        success: function(resp) {
            desktopMemChart = c3.generate({
                bindto: '#graph1',
                data: {
                    type: 'spline',
                    x: "x",
                    xFormat: '%H:%M:%S',
                    columns: [
                        formatTimeData(resp),
                        formatMemoryPercentData(resp)
                    ]
                },
                point: {
                    show: false
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            fit: true,
                            format: '%H:%M:%S'
                        }
                    },
                    y: {
                        tick: {
                            format: function(val) {
                                return String(val).substring(0, 5) + "%";
                            }
                        }
                    }
                },
                transition: {
                    duration: 50
                }
            });

            desktopCpuChart = c3.generate({
                bindto: '#graph2',
                data: {
                    type: "bar",
                    x: "x",
                    xFormat: '%H:%M:%S',
                    columns: [
                        formatTimeData(resp),
                        formatCpuUserData(resp),
                        formatCpuNiceData(resp),
                        formatCpuSysData(resp),
                        formatCpuIdleData(resp),
                        formatCpuIrqData(resp),
                    ],
                    groups: [
                        ['User', 'Idle', 'Nice', 'System', 'Interrupt Request']
                    ]
                },
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            fit: true,
                            format: '%H:%M:%S'
                        }
                    },
                    y: {
                        max: 100,
                        min: 0,
                        padding: {
                            top: 0,
                            bottom: 0
                        }
                    }
                },
                transition: {
                    duration: 50
                }
            });
        }
    });
}

var startPolling = function() {
    setInterval(function() {
        $.ajax({
            url: "http://localhost:8899",
            contentType: "application/json",
            success: function(resp) {
                //desktop
                desktopMemChart.load({
                    columns: [
                        formatTimeData(resp),
                        formatMemoryPercentData(resp)
                    ]
                });

                desktopCpuChart.load({
                    columns: [
                        formatTimeData(resp),
                        formatCpuUserData(resp),
                        formatCpuNiceData(resp),
                        formatCpuSysData(resp),
                        formatCpuIdleData(resp),
                        formatCpuIrqData(resp),
                    ]
                });
            }
        });
    }, 2000);
}

var formatMemoryPercentData = function(data) {
    var memArray = ['Free Memory'];
    for (var i = 0; i < data.length; i++) {
        memArray.push(data[i].mem.freePercent);
    };
    return memArray;
}
var formatTimeData = function(data) {
    var memArray = ['x'];
    for (var i = 0; i < data.length; i++) {
        memArray.push(data[i].time.hour);
    };
    return memArray;
}

var formatCpuUserData = function(data) {
    var cpuArray = ['User'];
    for (var i = 0; i < data.length; i++) {
        var cpuTotal = data[i].cpus[0].times.user + data[i].cpus[0].times.nice + data[i].cpus[0].times.sys + data[i].cpus[0].times.idle + data[i].cpus[0].times.irq;
        cpuArray.push((data[i].cpus[0].times.user / cpuTotal) * 100);
    };
    return cpuArray;
};
var formatCpuNiceData = function(data) {
    var cpuArray = ['Nice'];
    for (var i = 0; i < data.length; i++) {
        var cpuTotal = data[i].cpus[0].times.user + data[i].cpus[0].times.nice + data[i].cpus[0].times.sys + data[i].cpus[0].times.idle + data[i].cpus[0].times.irq;
        cpuArray.push((data[i].cpus[0].times.nice / cpuTotal) * 100);
    };
    return cpuArray;
};
var formatCpuSysData = function(data) {
    var cpuArray = ['System'];
    for (var i = 0; i < data.length; i++) {
        var cpuTotal = data[i].cpus[0].times.user + data[i].cpus[0].times.nice + data[i].cpus[0].times.sys + data[i].cpus[0].times.idle + data[i].cpus[0].times.irq;
        cpuArray.push((data[i].cpus[0].times.sys / cpuTotal) * 100);
    };
    return cpuArray;
};
var formatCpuIdleData = function(data) {
    var cpuArray = ['Idle'];
    for (var i = 0; i < data.length; i++) {
        var cpuTotal = data[i].cpus[0].times.user + data[i].cpus[0].times.nice + data[i].cpus[0].times.sys + data[i].cpus[0].times.idle + data[i].cpus[0].times.irq;
        cpuArray.push((data[i].cpus[0].times.idle / cpuTotal) * 100);
    };
    return cpuArray;
};
var formatCpuIrqData = function(data) {
    var cpuArray = ['Interrupt Request'];
    for (var i = 0; i < data.length; i++) {
        var cpuTotal = data[i].cpus[0].times.user + data[i].cpus[0].times.nice + data[i].cpus[0].times.sys + data[i].cpus[0].times.idle + data[i].cpus[0].times.irq;
        cpuArray.push((data[i].cpus[0].times.irq / cpuTotal) * 100);
    };
    return cpuArray;
};



//START
doInitialRequests();
startPolling();