import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';

import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { VariableService } from '../../../services/variable.service';

declare var d3: any;

@Component({
  selector: 'app-admin-triage-overview',
  templateUrl: './admin-triage-overview.component.html',
  styleUrls: ['./admin-triage-overview.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminTriageOverviewComponent implements OnInit {
  @ViewChild('wrapper', { static: true }) wrapper: ElementRef;
  public working = true;
  public variables: any;
  public triage = [];
  public terms = {
    name: 'Triage',
    children: []
  };
  public element: any;
  public i = 0;
  public duration = 750;
  public viewerWidth = 500;
  public viewerHeight = 500;
  public tree: any;
  public root: any;
  public zoomListener: any;
  public baseSvg: any;
  public svgGroup: any;
  public diagonal = function(d) {
    return 'M' + d.source.y + ',' + d.source.x
      + 'C' + (d.source.y + d.target.y) / 2 + ',' + d.source.x
      + ' ' + (d.source.y + d.target.y) / 2 + ',' + d.target.x
      + ' ' + d.target.y + ',' + d.target.x;
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private variableService: VariableService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer2: Renderer2,
    @Inject(DOCUMENT) private document,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      if (!document.getElementById('d3-script')) {
        const d = this.renderer2.createElement('script');
        d.src = 'https://cdnjs.cloudflare.com/ajax/libs/d3/5.5.0/d3.min.js';
        d.id = 'd3-script';
        this.renderer2.appendChild(this.document.body, d);
      }
    }
  }

  ngOnInit() {
    const self = this;
    this.variables = this.variableService;
    this.variables.adminTitle = 'Triage Overview';
    if (isPlatformBrowser(this.platformId)) {
      setTimeout (() => {
        this.tree = d3.tree().size([this.viewerHeight, this.viewerWidth]);
        this.zoomListener = d3.zoom().scaleExtent([0.1, 3]).on('zoom', function (e) {
          self.zoom(e);
        });
        this.loadTriage();
      }, 500);
    }
  }

  loadTriage() {
    const self = this;
    this.apiService.getAdminTriage().subscribe( result => {
      this.triage = result['triage'];
      this.triage.forEach(function(i) {
        self.process(i);
      });
      this.terms.children = this.triage;
      this.working = false;
      this.setupTree();
    });
  }

  setupTree() {
    const self = this;
    this.viewerWidth = this.wrapper.nativeElement.clientWidth ? this.wrapper.nativeElement.clientWidth : 900;
    this.viewerHeight = window.innerHeight - 120;
    this.baseSvg = d3.select('#tree-container').append('svg')
      .attr('width', this.viewerWidth)
      .attr('height', this.viewerHeight)
      .attr('class', 'overlay')
      .call(self.zoomListener);
    this.svgGroup = this.baseSvg.append('g');

    // Define the root
    this.root = d3.hierarchy(self.terms);
    this.root.x0 = this.viewerHeight / 2;
    this.root.y0 = 0;

    // Collapse all children of roots children before rendering.
    this.root.children.forEach(function(child){
      self.collapse(child);
    });

    // Layout the tree initially and center on the root node.
    this.update(self.root);
    this.centerNode(self.root);
  }

  process(d) {
    const self = this;
    if (d.children.length > 0) {
      d.children.forEach(function (i) {
        self.process(i);
      });
    } else if (d.term_export.field_entry_settings.length > 0) {
      d.entry = true;
      d.children = [];
      d.term_export.field_entry_settings.forEach(function(i) {
        i.entry = true;
        d.children.push(i);
      });
    } else if (d.term_export.field_redirect.length > 0) {
      d.redirect = true;
    }
  }

  collapse(d) {
    const self = this;
    if (d.children) {
      d._children = d.children;
      d._children.forEach(function (i) {
        self.collapse(i);
      });
      d.children = null;
    }
  }

  expand(d) {
    const self = this;
    if (d._children) {
      d.children = d._children;
      d.children.forEach(function (i) {
        self.expand(i);
      });
      d._children = null;
    }
  }

  zoom(e) {
    this.svgGroup.attr('transform', d3.event.transform);
  }

  centerNode(source) {
    const self = this;
    const z = d3.zoomTransform(self.baseSvg.node());
    const scale = z.k;
    const x = -source.y0;
    const y = -source.x0;
    z.x = x * scale + self.viewerWidth / 2;
    z.y = y * scale + self.viewerHeight / 2;
    self.svgGroup.attr('transform', z);
    z.scale(scale);
    z.translate(x, y);
  }

  toggleChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    return d;
  }

  click(d) {
    const self = this;
    if (d3.event.defaultPrevented) {
      return; // click suppressed
    }
    d = self.toggleChildren(d);
    self.update(d);
    self.centerNode(d);
  }

  update(source) {
    const self = this;
    const levelWidth = [1];
    const childCount = function(level, n) {
      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) {
          levelWidth.push(0);
        }
        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function(d) {
          childCount(level + 1, d);
        });
      }
    };
    childCount(0, this.root);
    const newHeight = d3.max(levelWidth) * 55; // 25 pixels per line
    this.tree = this.tree.size([newHeight, this.viewerWidth]);

    const newRoot = this.tree(this.root);

    // Compute the new tree layout.
    const nodes = newRoot.descendants(),
      links = newRoot.links();

    nodes.forEach(function(d) {
      d.y = (d.depth * 480);
    });

    // Update the nodes…
    const node = this.svgGroup.selectAll('g.node')
      .data(nodes, function(d) {
        return d.id || (d.id = ++self.i);
      });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append('g')
      .attr('transform', function(d) {
        return 'translate(' + source.y0 + ',' + source.x0 + ')';
      })
      .on('click', function (e) {
        self.click(e);
      });

    nodeEnter.append('circle')
      .attr('class', 'nodeCircle')
      .attr('r', 0)
      .style('fill', function(d) {
        return d._children ? '#00BCD4' : '#fff';
      });

    nodeEnter.append('text')
      .attr('x', function(d) {
        if (!d.children && !d._children && d.data.entry) {
          return '13';
        } else {
          return '-13';
        }
      })
      .attr('dy', '.35em')
      .attr('text-anchor', function(d) {
        if (!d.children && !d._children && d.data.entry) {
          return 'start';
        } else {
          return 'end';
        }
      })
      .attr('class', 'nodeText')
      .text(function(d) {
        if (d.data.name.length > 50) {
          return d.data.name.substr(0, 50) + '...';
        } else {
          return d.data.name;
        }
      })
      .call(this.getBB);

    nodeEnter.insert('rect', 'text')
      .attr('x', function(d){
        if (!d.children && !d._children && d.data.entry) {
          return 9;
        } else {
          return -d.bbox.width - 12;
        }
      })
      .attr('y', '-11')
      .attr('rx', '3')
      .attr('ry', '3')
      .attr('class', 'nodeBox')
      .attr('width', function(d){return d.bbox.width + 4})
      .attr('height', function(d){return d.bbox.height + 4});

    const nodeUpdate = nodeEnter.merge(node);

    // Transition nodes to their new position.
    nodeUpdate.transition()
      .duration(this.duration)
      .attr('class', function(d) {
        return 'node' + (d.children || d._children ? ' node--internal' : ' node--leaf') +
          (d.children ? ' active' : '') + (d.data.entry ? ' entry' : '') +
          (d.data.redirect ? ' redirect' : '');
      })
      .attr('transform', function(d) {
        return 'translate(' + d.y + ',' + d.x + ')';
      });

    nodeUpdate.select('circle.nodeCircle')
      .attr('r', 5)
      .style('fill', function(d) {
        return d._children ? '#00BCD4' : '#fff';
      });

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr('transform', function(d) {
        return 'translate(' + source.y + ',' + source.x + ')';
      })
      .remove();

    nodeExit.select('circle')
      .attr('r', 0);

    nodeExit.select('text')
      .style('fill-opacity', 0);

    // Update the links…
    const link = this.svgGroup.selectAll('path.link')
      .data(links, function(d) {
        return d.target.id;
      });

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().insert('path', 'g')
      .attr('class', 'link')
      .attr('d', function(d){
        const o = {
          source: {
            x: source.x0,
            y: source.y0
          },
          target: {
            x: source.x0,
            y: source.y0
          }
        };
        return self.diagonal(o);
      });

    const linkUpdate = linkEnter.merge(link);

    // Transition links to their new position.
    linkUpdate.transition()
      .duration(this.duration)
      .attr('d', this.diagonal);


    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(this.duration)
      .attr('d', function(d){
        const o = {
          source: {
            x: source.x,
            y: source.y
          },
          target: {
            x: source.x,
            y: source.y
          }
        };
        return self.diagonal(o);
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  getBB(selection) {
    selection.each(function(d){
      d.bbox = this.getBBox();
    });
  }

}
